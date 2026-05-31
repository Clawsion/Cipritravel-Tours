/**
 * Cloudflare Pages Function — Proxy para Web3Forms
 * Oculta a API key do lado do cliente
 * 
 * Para configurar:
 * 1. Vá a Cloudflare Dashboard > Pages > Cipritravel-Tours > Settings > Environment variables
 * 2. Adicione: WEB3FORMS_KEY = sua_chave_aqui
 * 3. Re-deploy o site
 */
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    // Obtém a key do environment variable (Cloudflare), ou fallback para a key do body
    const apiKey = env.WEB3FORMS_KEY || body._access_key;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'API key not configured' 
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Remove a key do body antes de reencaminhar
    const { _access_key, ...formData } = body;

    // Envia para o Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: apiKey, ...formData })
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
