// helpers.ts
import { TableName, QueryContext } from './types';
import { getTableMapping } from './tableMapping';

export function validateTableAccess(
  tableName: TableName,
  operation: 'read' | 'write' | 'delete',
  context: QueryContext
): boolean {
  const mapping = getTableMapping(tableName);

  if (!mapping.allowedOperations.includes(operation)) {
    return false;
  }

  switch (mapping.accessLevel) {
    case 'public':
      return true;
    case 'organization':
      return !!context.organisationId;
    case 'admin_only':
      return context.isAdmin;
    default:
      return false;
  }
}

export function formatError(error: any): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

export function logOperation(
  operation: string,
  tableName: string,
  details: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[useSupabaseOperations] ${operation} on ${tableName}`, details);
  }
}
