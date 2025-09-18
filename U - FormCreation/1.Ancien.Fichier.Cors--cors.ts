const allowedOrigins = [
  // 🏢 PRODUCTION
  'https://www.leadgenai-adbuilder.com',
  'https://leadgenai-adbuilder.com',

  // 🧪 TEST LOVABLE
  'https://appli-v7-leadgenai.lovable.app',

  // 🛠️ DÉVELOPPEMENT LOVABLE
  'https://lovable.dev',
  'https://lovable.app',
  /^https:\/\/.*\.lovable\.app$/,
  /^https:\/\/.*\.lovable\.dev$/,   

  // 🔧 DÉVELOPPEMENT LOCAL (si besoin)
  'http://localhost:3000',
  'http://localhost:5173',
]

export const getCorsHeaders = (origin: string | null) => {
  const isAllowed = allowedOrigins.some(allowed => {
    if (typeof allowed === 'string') return allowed === origin
    if (allowed instanceof RegExp) return allowed.test(origin || '')
    return false
  })
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}
