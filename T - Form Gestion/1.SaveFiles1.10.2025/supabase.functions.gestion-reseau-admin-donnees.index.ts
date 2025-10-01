import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { getCorsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { reseauId } = await req.json()
    if (!reseauId) throw new Error('reseauId requis')

    // Vérification admin_presenca via JWT
    const authHeader = req.headers.get('authorization')
    if (!authHeader) throw new Error('Non autorisé')
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) throw new Error('Token invalide')
    
    // Vérifier rôle admin_presenca
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('users')
      .select('users_role_systeme')
      .eq('users_auth_id', user.id)
      .single()
      
    if (roleError || userRole?.users_role_systeme !== 'admin_presenca') {
      throw new Error('Accès refusé - admin_presenca requis')
    }

    // 🔧 CORRECTION MAJEURE : Requêtes séparées au lieu de JOIN incorrect
    
    // 1. Récupérer données réseau principales
    const { data: reseau, error: reseauError } = await supabaseAdmin
      .from('reseau')
      .select(`
        reseau_id, organisation_id, reseau_nom, reseau_identite_commerciale,
        reseau_adresse, reseau_code_postal, reseau_ville, reseau_siret,
        reseau_statut, reseau_logo, reseau_ressources, reseau_telephone,
        reseau_email, reseau_brevo_connexion_id, reseau_zoho_connexion_id,
        reseau_openai_connexion_id, reseau_created_at, reseau_updated_at,
        reseau_created_by, reseau_updated_by
      `)
      .eq('reseau_id', reseauId)
      .single()

    if (reseauError) throw reseauError

    // 2. Récupérer intégrations en parallèle (méthode correcte)
    const integrations: any = {}

    // Intégration Brevo
    if (reseau.reseau_brevo_connexion_id) {
      const { data: brevo } = await supabaseAdmin
        .from('brevo_connexion')
        .select('brevo_connexion_id, brevo_api_key, brevo_email_compte, brevo_nom_compte')
        .eq('brevo_connexion_id', reseau.reseau_brevo_connexion_id)
        .single()
      integrations.brevo = brevo
    }

    // Intégration Zoho
    if (reseau.reseau_zoho_connexion_id) {
      const { data: zoho } = await supabaseAdmin
        .from('zoho_connexion')
        .select('zoho_connexion_id, zoho_api_key, zoho_email_compte, zoho_nom_compte')
        .eq('zoho_connexion_id', reseau.reseau_zoho_connexion_id)
        .single()
      integrations.zoho = zoho
    }

    // Intégration OpenAI
    if (reseau.reseau_openai_connexion_id) {
      const { data: openai } = await supabaseAdmin
        .from('openai_connexion')
        .select('openai_connexion_id, openai_api_key, openai_email_compte')
        .eq('openai_connexion_id', reseau.reseau_openai_connexion_id)
        .single()
      integrations.openai = openai
    }

    console.log(`[gestion-reseau-admin-donnees] ✅ Chargement réussi pour réseau ${reseauId}`)

    return new Response(
      JSON.stringify({ reseau, integrations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[gestion-reseau-admin-donnees] Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
