import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the session from the request
    const { data: { session } } = await supabaseClient.auth.getSession();

    // If no session, return 401
    if (!session) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;

    // Handle different HTTP methods
    if (req.method === 'GET') {
      // Get nutrition goals for the user
      const { data, error } = await supabaseClient
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data || {}), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (req.method === 'POST' || req.method === 'PUT') {
      // Update or create nutrition goals
      const requestData = await req.json();

      // Check if goals already exist for this user
      const { data: existingGoals } = await supabaseClient
        .from('nutrition_goals')
        .select('id')
        .eq('user_id', userId)
        .single();

      let result;

      if (existingGoals) {
        // Update existing goals
        result = await supabaseClient
          .from('nutrition_goals')
          .update({
            calories_target: requestData.calories_target,
            protein_target: requestData.protein_target,
            carbs_target: requestData.carbs_target,
            fat_target: requestData.fat_target,
            fiber_target: requestData.fiber_target,
          })
          .eq('id', existingGoals.id)
          .select();
      } else {
        // Create new goals
        result = await supabaseClient
          .from('nutrition_goals')
          .insert([
            {
              user_id: userId,
              calories_target: requestData.calories_target,
              protein_target: requestData.protein_target,
              carbs_target: requestData.carbs_target,
              fat_target: requestData.fat_target,
              fiber_target: requestData.fiber_target,
            },
          ])
          .select();
      }

      if (result.error) {
        return new Response(JSON.stringify({ error: result.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(result.data[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Método não permitido' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});