const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://xpdpdxjrithvzgfbetvz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZHBkeGpyaXRodnpnZmJldHZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ1ODYyMywiZXhwIjoyMDcwMDM0NjIzfQ.ULyQzUi3PK3uMu5wDuSRtHf8TMMVW-lTOFFxBwm8MpI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPhoneNumberColumn() {
  try {
    // Verificar se a coluna já existe
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'profiles')
      .eq('column_name', 'phone_number');

    if (columnsError) {
      console.error('Erro ao verificar colunas:', columnsError);
      return;
    }

    if (columns.length > 0) {
      console.log('Coluna phone_number já existe.');
      return;
    }

    // Adicionar a coluna phone_number
    console.log('Adicionando coluna phone_number...');
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE profiles ADD COLUMN phone_number TEXT UNIQUE;'
    });

    if (error) {
      console.error('Erro ao adicionar coluna:', error);
      return;
    }

    console.log('Coluna phone_number adicionada com sucesso.');
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

addPhoneNumberColumn();