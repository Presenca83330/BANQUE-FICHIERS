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

    if (req.method === 'POST') {
      // 🔧 UPLOAD DE FICHIERS selon votre design organisation-{uuid}/...
      const formData = await req.formData()
      const file = formData.get('file') as File
      const reseauId = formData.get('reseauId') as string
      const fileType = formData.get('fileType') as string // 'logo' ou 'document'

      if (!file || !reseauId || !fileType) {
        throw new Error('Paramètres manquants: file, reseauId, fileType requis')
      }

      // Récupérer l'organisation_id du réseau
      const { data: reseauInfo } = await supabaseAdmin
        .from('reseau')
        .select('organisation_id')
        .eq('reseau_id', reseauId)
        .single()

      if (!reseauInfo) throw new Error('Réseau introuvable')

      // 🔧 Construction du chemin selon votre design
      const organisationFolder = `organisation-${reseauInfo.organisation_id}`
      const subFolder = fileType === 'logo' ? '1-logos' : '2-documents-institutionnels'
      const timestamp = Date.now()
      const fileName = `${timestamp}-${file.name}`
      const fullPath = `${organisationFolder}/${subFolder}/${fileName}`

      // Upload vers le bucket
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('bucket-table-reseau')
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      console.log(`[gestion-reseau-admin-fichiers] ✅ Upload réussi: ${fullPath}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          path: fullPath,
          publicUrl: uploadData.path
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'DELETE') {
      // 🔧 SUPPRESSION DE FICHIERS sécurisée
      const { filePath } = await req.json()
      
      if (!filePath) throw new Error('filePath requis')

      // Supprimer du storage
      const { error: deleteError } = await supabaseAdmin.storage
        .from('bucket-table-reseau')
        .remove([filePath])

      if (deleteError) throw deleteError

      console.log(`[gestion-reseau-admin-fichiers] ✅ Suppression réussie: ${filePath}`)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Méthode non supportée')

  } catch (error) {
    console.error('[gestion-reseau-admin-fichiers] Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
