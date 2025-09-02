import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseError } from "./errors";
import { getTableName } from "./tableMapping";
import { OperationResult } from "./types";
import { useCurrentUser } from "@/components/HOOKS-STRATEGIQUE/2.HOOK-useCurrentUser/useCurrentUser";

// Hook centralisé pour les opérations Supabase avec gestion des erreurs et multi-tenant
export function useSupabaseOperations() {
  const { user } = useCurrentUser();

  // SELECT générique
  const select = useCallback(
    async (table: string, filters: Record<string, any> = {}): Promise<OperationResult> => {
      try {
        const tableName = getTableName(table);
        let query = supabase.from(tableName).select("*");

        if (user?.organisationId) {
          query = query.eq("organisation_id", user.organisationId);
        }

        for (const [key, value] of Object.entries(filters)) {
          query = query.eq(key, value);
        }

        const { data, error } = await query;
        if (error) throw error;

        return { ok: true, data };
      } catch (err: any) {
        return { ok: false, message: mapSupabaseError(err.message) };
      }
    },
    [user]
  );

  // INSERT générique
  const insert = useCallback(
    async (table: string, payload: Record<string, any>): Promise<OperationResult> => {
      try {
        if (!user?.organisationId) {
          return { ok: false, message: "Organisation non trouvée" };
        }

        if (user?.statut === "suspendu") {
          return { ok: false, message: "Votre compte est suspendu" };
        }

        const tableName = getTableName(table);
        const { data, error } = await supabase
          .from(tableName)
          .insert([{ ...payload, organisation_id: user.organisationId }])
          .select();

        if (error) throw error;
        return { ok: true, data };
      } catch (err: any) {
        return { ok: false, message: mapSupabaseError(err.message) };
      }
    },
    [user]
  );

  // UPDATE générique
  const update = useCallback(
    async (
      table: string,
      idField: string,
      idValue: string,
      payload: Record<string, any>
    ): Promise<OperationResult> => {
      try {
        if (!user?.organisationId) {
          return { ok: false, message: "Organisation non trouvée" };
        }

        if (user?.statut === "suspendu") {
          return { ok: false, message: "Votre compte est suspendu" };
        }

        const tableName = getTableName(table);
        const { data, error } = await supabase
          .from(tableName)
          .update({ ...payload })
          .eq(idField, idValue)
          .eq("organisation_id", user.organisationId)
          .select();

        if (error) throw error;
        return { ok: true, data };
      } catch (err: any) {
        return { ok: false, message: mapSupabaseError(err.message) };
      }
    },
    [user]
  );

  // DELETE générique
  const remove = useCallback(
    async (table: string, idField: string, idValue: string): Promise<OperationResult> => {
      try {
        if (!user?.organisationId) {
          return { ok: false, message: "Organisation non trouvée" };
        }

        if (user?.statut === "suspendu") {
          return { ok: false, message: "Votre compte est suspendu" };
        }

        const tableName = getTableName(table);
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(idField, idValue)
          .eq("organisation_id", user.organisationId);

        if (error) throw error;
        return { ok: true };
      } catch (err: any) {
        return { ok: false, message: mapSupabaseError(err.message) };
      }
    },
    [user]
  );

  return {
    select,
    insert,
    update,
    remove,
  };
}
