// supabase/functions/daily_summary/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inicializa o cliente do Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (_req) => {
  // Lógica para gerar o resumo diário
  // Por exemplo, buscar todos os consumos do dia e comparar com as metas
  // Em seguida, enviar um resumo via WhatsApp

  // Exemplo de busca de dados (você precisará adaptar para buscar dados reais)
  const { data, error } = await supabase
    .from('consumptions')
    .select('*')
    .gte('consumed_at', new Date().toISOString().split('T')[0]); // Apenas registros de hoje

  if (error) {
    console.error('Erro ao buscar dados:', error);
    return new Response(`Erro: ${error.message}`, { status: 500 });
  }

  // Processar os dados e gerar o resumo
  const summary = `Resumo do dia: ${data.length} itens consumidos.`;

  // Aqui você adicionaria a lógica para enviar o resumo via WhatsApp usando a API do Twilio

  console.log(summary);
  return new Response(summary, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
});