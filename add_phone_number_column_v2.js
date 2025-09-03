const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://xpdpdxjrithvzgfbetvz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZHBkeGpyaXRodnpnZmJldHZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ1ODYyMywiZXhwIjoyMDcwMDM0NjIzfQ.ULyQzUi3PK3uMu5wDuSRtHf8TMMVW-lTOFFxBwm8MpI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPhoneNumberColumn() {
  try {
    console.log('Tentando adicionar coluna phone_number...');
    // Usar rpc para executar SQL diretamente
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT UNIQUE;"
    });

    if (error) {
      console.error('Erro ao adicionar coluna:', error);
      return;
    }

    console.log('Coluna phone_number adicionada com sucesso (ou já existia).');
    console.log('Resultado:', data);
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

addPhoneNumberColumn();