export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'POST') {
    try {
      const { message } = await request.json();
      
      // Use the Workers AI binding
      const ai = env.AI_BINDING;
      
      const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant named Bob. Keep responses concise and friendly.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      });
      
      return new Response(JSON.stringify({ answer: response.response }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}
