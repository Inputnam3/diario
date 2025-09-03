// supabase/functions/ingest_whatsapp/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inicializa o cliente do Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Verifica se a requisição é um POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Extrai os dados do webhook do Twilio
    const { Body, From } = await req.json();

    // Aqui você pode adicionar a lógica para parsear a mensagem usando IA (opcional)
    // Por enquanto, vamos assumir que a mensagem é simples e não precisa de parse
    const item = Body;
    const userId = From; // No futuro, você pode mapear o número para um user_id real

    // Insere o registro no banco de dados
    const { data, error } = await supabase
      .from('consumptions')
      .insert([
        { user_id: userId, item: item, consumed_at: new Date() }
      ]);

    if (error) {
      console.error('Erro ao inserir no banco de dados:', error);
      return new Response(`Erro: ${error.message}`, { status: 500 });
    }

    // Retorna uma resposta para o usuário via WhatsApp
    const responseText = `Anotado: ${item}`;
    return new Response(responseText, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error('Erro ao processar a requisição:', err);
    return new Response(`Erro interno do servidor: ${err.message}`, { status: 500 });
  }
});