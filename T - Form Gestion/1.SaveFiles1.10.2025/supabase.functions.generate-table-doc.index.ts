import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration Supabase
const supabaseUrl = 'https://ksymahfrtvhnbeobsspt.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Génère la documentation complète d'une table Supabase
 */
async function generateTableDocumentation(tableName: string, status = 'actif', type = 'stratégique') {
  try {
    console.log(`🔄 Génération de la documentation pour la table: ${tableName}`);

    // 1. Définition SQL complète
    const { data: sqlDefinitionData, error: sqlError } = await supabase
      .rpc('gen_table_ddl', { p_schema: 'public', p_table: tableName });
    if (sqlError) throw new Error(`Erreur DDL: ${sqlError.message}`);
    const sqlDefinition = sqlDefinitionData || 'Définition SQL non disponible';

    // 2. Colonnes
    const { data: columns } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')
      .order('ordinal_position');

    // 3. Contraintes
    const { data: constraints } = await supabase
      .from('information_schema.table_constraints')
      .select('*')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');

    // 4. Index
    const { data: indexes } = await supabase
      .from('pg_indexes')
      .select('*')
      .eq('tablename', tableName);

    // 5. Triggers
    const { data: triggers } = await supabase
      .rpc('get_table_triggers', { p_table: tableName });

    // 6. Relations (FK)
    const { data: relations } = await supabase
      .from('information_schema.key_column_usage')
      .select('*')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');

    // 7. Policies RLS
    const { data: policies } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', tableName)
      .eq('schemaname', 'public');

    // 8. Fonctions liées (requête SQL directe)
    const { data: functionsResult } = await supabase
      .from('pg_proc')
      .select(`
        proname,
        prokind,
        pg_language!inner(lanname)
      `)
      .eq('pg_namespace.nspname', 'public');

    // Filtrer les fonctions qui mentionnent la table
    let functions: any[] = [];
    if (functionsResult) {
      // Récupérer les définitions de fonctions pour filtrer
      for (const func of functionsResult) {
        try {
          const { data: funcDef } = await supabase
            .rpc('pg_get_functiondef', { func_oid: func.oid });
          
          if (funcDef && funcDef.toLowerCase().includes(tableName.toLowerCase())) {
            functions.push({
              function_name: func.proname,
              function_type: func.prokind === 'f' ? 'FUNCTION' : 'TRIGGER',
              function_language: func.pg_language?.lanname || 'unknown',
              description: func.proname.includes(tableName) ? 'Fonction spécifique à la table' : 'Utilise cette table'
            });
          }
        } catch (err) {
          console.warn(`Erreur lors de la vérification de la fonction ${func.proname}`);
        }
      }
    }

    // Construction Markdown
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    let md = `# Documentation Table: ${tableName}\n\n`;
    md += `**Date de génération:** ${currentDate}  \n**Statut:** ${status}  \n**Type:** ${type}\n\n---\n\n`;

    // 1. DDL
    md += `## 1. DÉFINITION SQL\n\`\`\`sql\n${sqlDefinition}\n\`\`\`\n\n---\n\n`;

    // 2. Colonnes
    md += `## 2. STRUCTURE DE LA TABLE\n\n| Colonne | Type | Nullable | Défaut | Description |\n|---------|------|----------|--------|-------------|\n`;
    if (columns?.length) {
      columns.forEach(col => {
        md += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable === 'YES' ? 'Oui' : 'Non'} | ${col.column_default || 'Aucun'} | - |\n`;
      });
    } else {
      md += `| - | - | - | - | - |\n`;
    }
    md += `\n---\n\n`;

    // 3. Contraintes
    md += `## 3. CONTRAINTES\n`;
    constraints?.forEach(c => {
      md += `- **${c.constraint_type}**: ${c.constraint_name}\n`;
    });
    md += `\n---\n\n`;

    // 4. Index
    md += `## 4. INDEX\n`;
    indexes?.forEach(idx => {
      md += `- ${idx.indexname}: ${idx.indexdef}\n`;
    });
    md += `\n---\n\n`;

    // 5. Triggers
    md += `## 5. TRIGGERS\n`;
    if (triggers?.length) {
      triggers.forEach(tg => {
        md += `- **${tg.trigger_name}** (${tg.trigger_timing} ${tg.trigger_event}): ${tg.trigger_function}\n`;
      });
    } else {
      md += `Aucun trigger trouvé\n`;
    }
    md += `\n---\n\n`;

    // 6. Relations
    md += `## 6. RELATIONS ENTRE TABLES (FK)\n`;
    if (relations?.length) {
      relations.forEach(r => {
        md += `- ${r.table_name}.${r.column_name} → ${r.constraint_name}\n`;
      });
    } else {
      md += `Aucune relation FK trouvée\n`;
    }
    md += `\n---\n\n`;

    // 7. Policies RLS
    md += `## 7. SÉCURITÉ RLS\n`;
    if (policies?.length) {
      policies.forEach(p => {
        md += `### ${p.policyname}\n- **Commande:** ${p.cmd}\n- **Rôles:** ${p.roles?.join(', ') || 'Tous'}\n- **Expression USING:** \`${p.qual || 'Aucune'}\`\n- **Expression WITH CHECK:** \`${p.with_check || 'Aucune'}\`\n\n`;
      });
    } else {
      md += `Aucune policy RLS trouvée\n`;
    }
    md += `\n---\n\n`;

    // 8. Fonctions liées
    md += `## 🔧 FONCTIONS LIÉES\n`;
    md += `**Fonctions utilisant cette table**\n\n`;
    if (functions?.length) {
      functions.forEach(fn => {
        md += `- **${fn.function_name}()**: ${fn.description}\n`;
      });
    } else {
      md += `Aucune fonction liée trouvée\n`;
    }
    md += `\n---\n\n`;

    // Notes techniques
    md += `## 9. NOTES TECHNIQUES\n- **Dernière mise à jour:** ${currentDate}\n- **Source:** Supabase Database (temps réel)\n- **Générateur:** Lovable AI Documentation Tool (enrichi)\n- **Fichier:** generate-table-doc edge function\n`;

    return md;

  } catch (error) {
    console.error(`❌ Erreur lors de la génération de la documentation:`, error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tableName, status = 'actif', type = 'stratégique' } = await req.json();

    if (!tableName) {
      return new Response(
        JSON.stringify({ error: 'tableName est requis' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`🚀 Génération de documentation pour: ${tableName}`);
    
    const documentation = await generateTableDocumentation(tableName, status, type);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        documentation,
        tableName 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Erreur:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur interne' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
