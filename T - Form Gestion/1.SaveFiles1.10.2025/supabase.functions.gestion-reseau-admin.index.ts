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

    // Récupérer tous les réseaux (BYPASS RLS avec SERVICE_ROLE_KEY)
    const { data: reseaux, error } = await supabaseAdmin
      .from('reseau')
      .select('reseau_id, reseau_nom, reseau_statut, organisation_id')
      .order('reseau_nom')

    if (error) throw error

    console.log(`[gestion-reseau-admin] Chargement réussi de ${reseaux?.length || 0} réseaux pour admin ${user.email}`)

    return new Response(
      JSON.stringify(reseaux || []),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[gestion-reseau-admin] Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
