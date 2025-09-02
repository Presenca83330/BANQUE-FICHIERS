import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMultiTenant } from '../3.HOOK-useMultiTenant/useMultiTenant';
import {
  SupabaseOperationError,
  ValidationError,
  NetworkError,
  AccessDeniedError
} from './errors';
import {
  QueryContext,
  TableName,
  QueryResult,
  MutationResult,
  QueryOptions,
  UpdateOptions,
  DeleteOptions
} from './types';
import { validateTableAccess, formatError, logOperation } from './helpers';
import { getTableMapping } from './tableMapping';

export function useSupabaseOperations() {
  const {
    effectiveOrganisationId,
    isSystemAdmin,
    requireTenantAccess,
    getTenantContext,
    organisationStatus
  } = useMultiTenant();

  const _wrapCtx = useCallback(
    (tableName: TableName): QueryContext => {
      const ctx = getTenantContext();
      return {
        tableName,
        organisationId: ctx.effectiveOrganisationId,
        isAdmin: ctx.isSystemAdmin ?? false,
        isImpersonating: ctx.isImpersonating ?? false,
        currentUserId: null,
        organisationStatus: ['actif', 'suspendu', 'desactive'].includes(ctx.organisationStatus as string) 
          ? (ctx.organisationStatus as 'actif' | 'suspendu' | 'desactive') 
          : null
      };
    },
    [getTenantContext]
  );

  const validateBeforeQuery = useCallback(
    async (
      tableName: TableName,
      operation: 'read' | 'write' | 'delete'
    ): Promise<QueryContext> => {
      try {
        await requireTenantAccess();
        const context = _wrapCtx(tableName);

        if (!validateTableAccess(tableName, operation, context)) {
          throw new AccessDeniedError(
            `Access denied for ${operation} on ${tableName}`
          );
        }

        return context;
      } catch (error) {
        if (error instanceof AccessDeniedError) {
          throw error;
        }
        throw new ValidationError(`Validation failed: ${formatError(error)}`);
      }
    },
    [requireTenantAccess, _wrapCtx]
  );

  const query = useCallback(
    async <T = any>(
      tableName: TableName,
      options: QueryOptions = {}
    ): Promise<QueryResult<T[]>> => {
      const startTime = Date.now();
      try {
        const context = await validateBeforeQuery(tableName, 'read');
        const mapping = getTableMapping(tableName);

        let queryBuilder: any = supabase
          .from(tableName as any)
          .select((options.select || '*') as any);

        if (!isSystemAdmin && mapping.organisationField) {
          queryBuilder = queryBuilder.eq(
            mapping.organisationField,
            context.organisationId
          );
        }

        if (options.filters) {
          for (const [key, value] of Object.entries(options.filters)) {
            queryBuilder = queryBuilder.eq(key, value);
          }
        }

        if (options.orderBy) {
          queryBuilder = queryBuilder.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true
          });
        }

        if (options.limit) {
          queryBuilder = queryBuilder.limit(options.limit);
        }

        if (options.offset) {
          queryBuilder = queryBuilder.range(
            options.offset,
            options.offset + (options.limit || 100) - 1
          );
        }

        const { data, error, count } = await queryBuilder;

        if (error) {
          throw new NetworkError(`Database query failed: ${error.message}`, error);
        }

        return {
          data: (data as T[]) || [],
          error: null,
          count: count || (Array.isArray(data) ? data.length : 0),
          context
        };
      } catch (error) {
        const formattedError =
          error instanceof SupabaseOperationError
            ? error
            : new SupabaseOperationError(`Query failed: ${formatError(error)}`);

        return {
          data: [],
          error: formattedError,
          count: 0,
          context: _wrapCtx(tableName)
        };
      } finally {
        logOperation('query', tableName, { duration: Date.now() - startTime });
      }
    },
    [validateBeforeQuery, isSystemAdmin, _wrapCtx]
  );

  const queryOne = useCallback(
    async <T = any>(
      tableName: TableName,
      id: string,
      options: Omit<QueryOptions, 'limit' | 'offset'> = {}
    ): Promise<QueryResult<T | null>> => {
      const result = await query<T>(tableName, {
        ...options,
        filters: { ...options.filters, id },
        limit: 1
      });

      return {
        ...result,
        data: Array.isArray(result.data) && result.data.length > 0 ? result.data[0] : null
      };
    },
    [query]
  );

  const update = useCallback(
    async <T = any>(
      tableName: TableName,
      id: string,
      updates: Record<string, any>,
      options: UpdateOptions = {}
    ): Promise<MutationResult<T>> => {
      const startTime = Date.now();
      try {
        const context = await validateBeforeQuery(tableName, 'write');
        const mapping = getTableMapping(tableName);

        let queryBuilder: any = supabase.from(tableName as any).update(updates).eq('id', id);

        if (!isSystemAdmin && mapping.organisationField) {
          queryBuilder = queryBuilder.eq(mapping.organisationField, context.organisationId);
        }

        if (options.returning) {
          queryBuilder = queryBuilder.select(options.select || '*');
        }

        const { data, error } = await queryBuilder;

        if (error) {
          throw new NetworkError(`Update failed: ${error.message}`, error);
        }

        return {
          data: options.returning
            ? (Array.isArray(data) && data.length > 0 ? (data[0] as T) : null)
            : null,
          error: null,
          context
        };
      } catch (error) {
        const formattedError =
          error instanceof SupabaseOperationError
            ? error
            : new SupabaseOperationError(`Update failed: ${formatError(error)}`);

        return {
          data: null,
          error: formattedError,
          context: _wrapCtx(tableName)
        };
      } finally {
        logOperation('update', tableName, { duration: Date.now() - startTime });
      }
    },
    [validateBeforeQuery, isSystemAdmin, _wrapCtx]
  );

  const create = useCallback(
    async <T = any>(
      tableName: TableName,
      data: Record<string, any>,
      options: UpdateOptions = {}
    ): Promise<MutationResult<T>> => {
      const startTime = Date.now();
      try {
        const context = await validateBeforeQuery(tableName, 'write');
        const mapping = getTableMapping(tableName);

        const finalData = { ...data };
        if (!isSystemAdmin && mapping.organisationField) {
          finalData[mapping.organisationField] = context.organisationId;
        }

        let queryBuilder: any = supabase.from(tableName as any).insert(finalData);

        if (options.returning !== false) {
          queryBuilder = queryBuilder.select(options.select || '*');
        }

        const { data: result, error } = await queryBuilder;

        if (error) {
          throw new NetworkError(`Create failed: ${error.message}`, error);
        }

        return {
          data: Array.isArray(result) && result.length > 0 ? (result[0] as T) : null,
          error: null,
          context
        };
      } catch (error) {
        const formattedError =
          error instanceof SupabaseOperationError
            ? error
            : new SupabaseOperationError(`Create failed: ${formatError(error)}`);

        return {
          data: null,
          error: formattedError,
          context: _wrapCtx(tableName)
        };
      } finally {
        logOperation('create', tableName, { duration: Date.now() - startTime });
      }
    },
    [validateBeforeQuery, isSystemAdmin, _wrapCtx]
  );

  const remove = useCallback(
    async (
      tableName: TableName,
      id: string,
      options: DeleteOptions = {}
    ): Promise<MutationResult<null>> => {
      const startTime = Date.now();
      try {
        const context = await validateBeforeQuery(tableName, 'delete');
        const mapping = getTableMapping(tableName);

        let queryBuilder: any = supabase.from(tableName as any).delete().eq('id', id);

        if (!isSystemAdmin && mapping.organisationField) {
          queryBuilder = queryBuilder.eq(mapping.organisationField, context.organisationId);
        }

        const { error } = await queryBuilder;

        if (error) {
          throw new NetworkError(`Delete failed: ${error.message}`, error);
        }

        return {
          data: null,
          error: null,
          context
        };
      } catch (error) {
        const formattedError =
          error instanceof SupabaseOperationError
            ? error
            : new SupabaseOperationError(`Delete failed: ${formatError(error)}`);

        return {
          data: null,
          error: formattedError,
          context: _wrapCtx(tableName)
        };
      } finally {
        logOperation('delete', tableName, { duration: Date.now() - startTime });
      }
    },
    [validateBeforeQuery, isSystemAdmin, _wrapCtx]
  );

  return useMemo(
    () => ({
      query,
      queryOne,
      create,
      update,
      remove,
      effectiveOrganisationId,
      isSystemAdmin,
      organisationStatus,
      getTableMapping: (table: TableName) => getTableMapping(table),
      validateAccess: (table: TableName, operation: 'read' | 'write' | 'delete') =>
        validateBeforeQuery(table, operation)
    }),
    [
      query,
      queryOne,
      create,
      update,
      remove,
      effectiveOrganisationId,
      isSystemAdmin,
      organisationStatus,
      validateBeforeQuery
    ]
  );
}
