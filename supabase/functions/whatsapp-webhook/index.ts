import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Interface para o payload do Twilio
interface TwilioPayload {
  Body: string
  From: string
  To: string
  MessageSid: string
  NumMedia: string
}

// Interface para os dados do usuário
interface UserProfile {
  user_id: string
  name?: string
  phone_number: string
}

// Interface para os dados da mensagem processada
interface ParsedMessage {
  food: string
  quantity: number
  meal_type: string
  calories?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
}

// Função para validar a assinatura do webhook do Twilio
async function validateTwilioRequest(
  request: Request,
  authToken: string
): Promise<boolean> {
  // Implementar validação de assinatura do Twilio aqui
  // Por enquanto, retornamos true para fins de desenvolvimento
  return true
}

// Função para analisar a mensagem do usuário
function parseMessage(message: string): ParsedMessage | null {
  // Limpa e padroniza a mensagem
  const cleanMessage = message.trim().toLowerCase()
  
  // Tenta diferentes padrões de mensagem
  const patterns = [
    // Padrão: "comi 150g de arroz no almoço"
    /com[ií]\s+(\d+)\s*g(?:ramas?)?\s+de\s+(.+?)(?:\s+no\s+(caf[ée]|almo[çc]o|jantar|lanche|ceia))?/i,
    // Padrão: "almoço: 150g de arroz"
    /(caf[ée]|almo[çc]o|jantar|lanche|ceia):?\s*(\d+)\s*g(?:ramas?)?\s+de\s+(.+)/i,
    // Padrão: "150g arroz" (assume almoço como padrão)
    /(\d+)\s*g(?:ramas?)?\s+(.+)/i
  ]

  for (const pattern of patterns) {
    const match = cleanMessage.match(pattern)
    if (match) {
      // Extrai os grupos de captura baseado no padrão
      let quantity, food, mealType
      
      if (match[1] && match[2] && match[3]) {
        // Primeiro padrão: "comi 150g de arroz no almoço"
        quantity = parseInt(match[1])
        food = match[2].trim()
        mealType = match[3] || 'almoço' // Padrão para almoço se não especificado
      } else if (match[1] && match[2] && match[3]) {
        // Segundo padrão: "almoço: 150g de arroz"
        mealType = match[1]
        quantity = parseInt(match[2])
        food = match[3].trim()
      } else {
        // Terceiro padrão: "150g arroz"
        quantity = parseInt(match[1])
        food = match[2].trim()
        mealType = 'almoço' // Padrão para almoço
      }

      // Normaliza o tipo de refeição
      const normalizedMealType = normalizeMealType(mealType)

      return {
        food: food.charAt(0).toUpperCase() + food.slice(1), // Capitaliza a primeira letra
        quantity,
        meal_type: normalizedMealType
      }
    }
  }

  return null
}

// Função para normalizar os tipos de refeição
function normalizeMealType(mealType: string): string {
  const mealTypes: Record<string, string> = {
    'cafe': 'café da manhã',
    'café': 'café da manhã',
    'café da manha': 'café da manhã',
    'cafe da manha': 'café da manhã',
    'almoco': 'almoço',
    'almoco': 'almoço',
    'janta': 'jantar',
    'jantar': 'jantar',
    'lanche': 'lanche',
    'ceia': 'ceia',
    'lanche da manha': 'lanche da manhã',
    'lanche da tarde': 'lanche da tarde',
    'lanche da noite': 'ceia'
  }

  const normalized = mealType.toLowerCase().trim()
  return mealTypes[normalized] || normalized
}

// Função para buscar informações nutricionais do alimento
async function getFoodNutrition(
  supabase: any,
  foodName: string
): Promise<{ calories: number; protein_g: number; carbs_g: number; fat_g: number } | null> {
  try {
    // Tenta encontrar o alimento no banco de dados
    const { data, error } = await supabase
      .from('foods')
      .select('calories_per_100g, protein_g, carbs_g, fat_g')
      .ilike('name', `%${foodName}%`)
      .limit(1)

    if (error) throw error
    if (data && data.length > 0) {
      return {
        calories: data[0].calories_per_100g,
        protein_g: data[0].protein_g,
        carbs_g: data[0].carbs_g,
        fat_g: data[0].fat_g
      }
    }

    // Se não encontrar no banco de dados, retorna valores padrão
    // Em uma implementação real, você poderia integrar com uma API de nutrição aqui
    return {
      calories: 0, // Valor padrão
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0
    }
  } catch (error) {
    console.error('Erro ao buscar informações nutricionais:', error)
    return null
  }
}

// Função para buscar o perfil do usuário pelo número de telefone
async function getUserProfile(
  supabase: any,
  phoneNumber: string
): Promise<UserProfile | null> {
  try {
    // Remove o prefixo 'whatsapp:' do número de telefone
    const cleanPhone = phoneNumber.replace(/^whatsapp:/, '')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, name, phone_number')
      .eq('phone_number', cleanPhone)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error)
    return null
  }
}

// Função para salvar o registro alimentar
async function saveFoodEntry(
  supabase: any,
  userId: string,
  parsedMessage: ParsedMessage
) {
  try {
    const { error } = await supabase
      .from('registros_alimentares')
      .insert([
        {
          user_id: userId,
          alimento: parsedMessage.food,
          quantidade_g: parsedMessage.quantity,
          tipo_refeicao: parsedMessage.meal_type,
          data_registro: new Date().toISOString()
        }
      ])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar registro alimentar:', error)
    return { success: false, error }
  }
}

// Função para enviar uma resposta ao WhatsApp
function sendWhatsAppResponse(to: string, message: string) {
  // Em uma implementação real, você usaria a API do Twilio para enviar a mensagem
  console.log(`Enviando mensagem para ${to}: ${message}`)
  // Implementação real usaria o cliente Twilio aqui
  return { success: true }
}

// Função principal da Edge Function
serve(async (req: Request) => {
  // Configura o CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  // Valida o método da requisição
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Inicializa o cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Valida a requisição do Twilio
    const isRequestValid = await validateTwilioRequest(req, twilioAuthToken)
    if (!isRequestValid) {
      return new Response(
        JSON.stringify({ error: 'Requisição não autorizada' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Extrai os dados do formulário da requisição
    const formData = await req.formData()
    const twilioPayload: TwilioPayload = {
      Body: formData.get('Body')?.toString() || '',
      From: formData.get('From')?.toString() || '',
      To: formData.get('To')?.toString() || '',
      MessageSid: formData.get('MessageSid')?.toString() || '',
      NumMedia: formData.get('NumMedia')?.toString() || '0'
    }

    // Verifica se há mídia na mensagem
    if (parseInt(twilioPayload.NumMedia) > 0) {
      // Se houver mídia, responde que não é suportado
      sendWhatsAppResponse(
        twilioPayload.From,
        'Desculpe, ainda não suportamos o processamento de mídia. Por favor, descreva sua refeição em texto.'
      )
      return new Response('Mensagem de mídia recebida - não processada')
    }

    // Processa a mensagem de texto
    const messageBody = twilioPayload.Body.trim()
    if (!messageBody) {
      return new Response('Mensagem vazia recebida')
    }

    // Encontra o perfil do usuário
    const userProfile = await getUserProfile(supabase, twilioPayload.From)
    if (!userProfile) {
      sendWhatsAppResponse(
        twilioPayload.From,
        '❌ Usuário não encontrado. Por favor, cadastre-se no nosso aplicativo primeiro.'
      )
      return new Response('Usuário não encontrado', { status: 404 })
    }

    // Analisa a mensagem para extrair informações
    const parsedMessage = parseMessage(messageBody)
    if (!parsedMessage) {
      sendWhatsAppResponse(
        twilioPayload.From,
        '❌ Não entendi sua mensagem. Por favor, use o formato: "Comi 150g de arroz no almoço" ou similar.'
      )
      return new Response('Mensagem não pôde ser processada', { status: 400 })
    }

    // Busca informações nutricionais do alimento
    const nutritionInfo = await getFoodNutrition(supabase, parsedMessage.food)
    if (nutritionInfo) {
      // Calcula os valores com base na quantidade
      const multiplier = parsedMessage.quantity / 100
      parsedMessage.calories = Math.round(nutritionInfo.calories * multiplier)
      parsedMessage.protein_g = parseFloat((nutritionInfo.protein_g * multiplier).toFixed(1))
      parsedMessage.carbs_g = parseFloat((nutritionInfo.carbs_g * multiplier).toFixed(1))
      parsedMessage.fat_g = parseFloat((nutritionInfo.fat_g * multiplier).toFixed(1))
    }

    // Salva o registro alimentar
    const saveResult = await saveFoodEntry(supabase, userProfile.user_id, parsedMessage)
    if (!saveResult.success) {
      throw new Error('Falha ao salvar registro alimentar')
    }

    // Prepara mensagem de confirmação
    let responseMessage = `✅ Registro salvo!\n`
    responseMessage += `🍽️ ${parsedMessage.meal_type}: ${parsedMessage.quantity}g de ${parsedMessage.food}\n`
    
    if (parsedMessage.calories) {
      responseMessage += `🔥 ${parsedMessage.calories} kcal\n`
      responseMessage += `🥩 ${parsedMessage.protein_g}g proteína | `
      responseMessage += `🍚 ${parsedMessage.carbs_g}g carboidratos | `
      responseMessage += `🥑 ${parsedMessage.fat_g}g gorduras`
    }

    // Envia a mensagem de confirmação
    sendWhatsAppResponse(twilioPayload.From, responseMessage)

    return new Response('Registro processado com sucesso')
  } catch (error) {
    console.error('Erro ao processar a requisição:', error)
    
    // Tenta enviar mensagem de erro para o usuário
    try {
      const formData = await req.formData()
      const from = formData.get('From')?.toString()
      if (from) {
        sendWhatsAppResponse(
          from,
          '❌ Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.'
        )
      }
    } catch (e) {
      console.error('Erro ao enviar mensagem de erro:', e)
    }

    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
