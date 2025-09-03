const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://xpdpdxjrithvzgfbetvz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZHBkeGpyaXRodnpnZmJldHZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ1ODYyMywiZXhwIjoyMDcwMDM0NjIzfQ.ULyQzUi3PK3uMu5wDuSRtHf8TMMVW-lTOFFxBwm8MpI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
  const phoneNumber = 'whatsapp:+5511999999999';
  const cleanPhone = phoneNumber.replace(/^whatsapp:/, '');
  
  console.log(`Verificando usuário com número de telefone: ${cleanPhone}`);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, phone_number')
      .eq('phone_number', cleanPhone)
      .single();

    if (error) {
      console.error('Erro ao buscar usuário:', error);
      return;
    }

    if (!data) {
      console.log('Usuário não encontrado.');
      return;
    }

    console.log('Usuário encontrado:', data);
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

checkUser();