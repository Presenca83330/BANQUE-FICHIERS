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
    const { reseauId, generalData, integrationKind, integrationData } = await req.json()
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

    let updatedReseauData = null
    let updatedIntegrationData = null

    // 🔧 CORRECTION : Mise à jour des données générales du réseau
    if (generalData) {
      // Récupérer l'utilisateur interne pour les champs audit
      const { data: internalUser } = await supabaseAdmin
        .from('users')
        .select('users_id')
        .eq('users_auth_id', user.id)
        .single()

      // Mise à jour table reseau avec champs audit corrects
      const { data: updatedReseau, error: updateError } = await supabaseAdmin
        .from('reseau')
        .update({
          ...generalData,
          reseau_updated_at: new Date().toISOString(),
          reseau_updated_by: internalUser?.users_id || null
        })
        .eq('reseau_id', reseauId)
        .select('*')
        .single()

      if (updateError) throw updateError
      updatedReseauData = updatedReseau

      console.log(`[gestion-reseau-admin-update] ✅ Mise à jour réseau ${reseauId} réussie`)
    }

    // 🔧 CORRECTION : Gestion des intégrations
    if (integrationKind && integrationData) {
      const tables = {
        brevo: { table: 'brevo_connexion', idField: 'brevo_connexion_id', reseauField: 'reseau_brevo_connexion_id' },
        zoho: { table: 'zoho_connexion', idField: 'zoho_connexion_id', reseauField: 'reseau_zoho_connexion_id' },
        openai: { table: 'openai_connexion', idField: 'openai_connexion_id', reseauField: 'reseau_openai_connexion_id' }
      }

      const config = tables[integrationKind as keyof typeof tables]
      if (!config) throw new Error(`Type d'intégration non supporté: ${integrationKind}`)

      // Récupérer l'organisation_id du réseau
      const { data: reseauInfo } = await supabaseAdmin
        .from('reseau')
        .select('organisation_id, ' + config.reseauField)
        .eq('reseau_id', reseauId)
        .single()

      if (!reseauInfo) throw new Error('Réseau introuvable')

      const connexionId = reseauInfo[config.reseauField]

      if (connexionId) {
        // Mise à jour d'une intégration existante
        const { data: updated, error: updateIntError } = await supabaseAdmin
          .from(config.table)
          .update(integrationData)
          .eq(config.idField, connexionId)
          .select('*')
          .single()

        if (updateIntError) throw updateIntError
        updatedIntegrationData = updated
      } else {
        // Création d'une nouvelle intégration
        const integrationWithMeta = {
          ...integrationData,
          organisation_id: reseauInfo.organisation_id,
          reseau_id: reseauId
        }

        const { data: newIntegration, error: insertError } = await supabaseAdmin
          .from(config.table)
          .insert(integrationWithMeta)
          .select('*')
          .single()

        if (insertError) throw insertError

        // Mettre à jour la référence dans la table reseau
        const { error: linkError } = await supabaseAdmin
          .from('reseau')
          .update({ [config.reseauField]: newIntegration[config.idField] })
          .eq('reseau_id', reseauId)

        if (linkError) throw linkError
        updatedIntegrationData = newIntegration
      }

      console.log(`[gestion-reseau-admin-update] ✅ Intégration ${integrationKind} mise à jour`)
    }

    // Retour optimisé des données mises à jour
    const response: any = { success: true }
    
    if (updatedReseauData) {
      response.updatedData = { reseau: updatedReseauData }
    }
    
    if (updatedIntegrationData) {
      response.updatedData = response.updatedData || {}
      response.updatedData.integrations = {
        [integrationKind!]: updatedIntegrationData
      }
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[gestion-reseau-admin-update] Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
