import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { getCorsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface ReseauCreationData {
  nomReseau: string
  adresse: string
  codePostal: string
  ville: string
  siret: string
  nomResponsable: string
  prenomResponsable: string
  emailResponsable: string
  telephoneResponsable: string
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // ⚠️ TEMPORAIRE: JWT vérification désactivée pour tests
    console.log('🔓 TEST MODE: JWT verification disabled')

    // Parse and validate request data
    const formData: ReseauCreationData = await req.json()
    
    // 🔒 LOGS SÉCURISÉS : Pas d'email/téléphone en clair
    console.log('📝 CREATION: Starting reseau creation', {
      nomReseau: formData.nomReseau,
      ville: formData.ville,
      siret: formData.siret?.slice(0, 4) + '***', // SIRET partiel
      hasEmail: !!formData.emailResponsable,
      hasPhone: !!formData.telephoneResponsable
    })

    // Validation des données
    if (!formData.emailResponsable || !formData.emailResponsable.includes('@')) {
      throw new Error('Email invalide')
    }

    if (!formData.siret || formData.siret.length !== 14) {
      throw new Error('SIRET invalide (14 chiffres requis)')
    }

    // Générer mot de passe temporaire
    const tempPassword = crypto.randomUUID().slice(0, 12)
    console.log('🔑 PASSWORD: Temporary password generated')

    // 1. Créer l'utilisateur Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.emailResponsable,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        nom: formData.nomResponsable,
        prenom: formData.prenomResponsable,
        type_compte: 'reseau'
      }
    })

    if (authError || !authUser.user) {
      console.log('❌ AUTH: User creation failed', { error: authError?.message })
      throw new Error(`Erreur création Auth: ${authError?.message}`)
    }

    console.log('✅ AUTH: User created successfully')

    try {
      // 2. Appeler la fonction SQL pour créer le compte complet
      const { data: sqlResult, error: sqlError } = await supabaseAdmin.rpc('create_reseau_compte_complet', {
        p_nom_reseau: formData.nomReseau,
        p_adresse: formData.adresse,
        p_code_postal: formData.codePostal,
        p_ville: formData.ville,
        p_siret: formData.siret,
        p_nom_responsable: formData.nomResponsable,
        p_prenom_responsable: formData.prenomResponsable,
        p_email_responsable: formData.emailResponsable,
        p_telephone_responsable: formData.telephoneResponsable,
        p_auth_uid: authUser.user.id
      })

      if (sqlError) {
        console.log('❌ SQL: Database creation failed', { error: sqlError.message })
        throw new Error(`Erreur base de données: ${sqlError.message}`)
      }

      console.log('✅ SQL: Database records created successfully')

      // Retourner le résultat avec mot de passe temporaire
      return new Response(
        JSON.stringify({
          success: true,
          data: sqlResult,
          tempPassword: tempPassword,
          message: 'Compte réseau créé avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (sqlError) {
      // 🔄 ROLLBACK : Supprimer l'utilisateur Auth en cas d'erreur SQL
      console.log('🔄 ROLLBACK: Deleting auth user due to SQL error')
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      throw sqlError
    }

  } catch (error) {
    console.log('❌ ERROR: Creation failed', { error: error.message })
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur lors de la création du compte réseau' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
