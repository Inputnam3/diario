const { Client } = require('pg');

// Configurações do banco de dados do Supabase
const dbConfig = {
  connectionString: 'postgresql://postgres:[8wK5mSVB5u33W17M]@db.xpdpdxjrithvzgfbetvz.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false // Apenas para desenvolvimento, em produção deve ser true
  }
};

// Função principal
async function main() {
  const client = new Client(dbConfig);
  
  try {
    // Conectar ao banco de dados
    await client.connect();
    console.log('Conectado ao banco de dados do Supabase com sucesso.');
    
    // Verificar tabelas
    const tables = ['profiles', 'consumptions', 'nutrition_goals', 'food_entries', 'registros_alimentares', 'foods'];
    
    for (const table of tables) {
      console.log(`\n--- Estrutura da tabela ${table} ---`);
      try {
        const res = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [table]);
        
        if (res.rows.length === 0) {
          console.log(`  Tabela ${table} não encontrada.`);
          continue;
        }
        
        console.log('Colunas:');
        res.rows.forEach(row => {
          console.log(`  ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
        });
        
        // Verificar constraints (chaves primárias, estrangeiras, etc)
        console.log('\nConstraints:');
        const constraintsRes = await client.query(`
          SELECT constraint_name, constraint_type
          FROM information_schema.table_constraints
          WHERE table_name = $1;
        `, [table]);
        
        constraintsRes.rows.forEach(row => {
          console.log(`  ${row.constraint_name} (${row.constraint_type})`);
        });
      } catch (err) {
        console.error(`  Erro ao verificar tabela ${table}:`, err.message);
      }
    }
    
    console.log('\n--- Verificação concluída ---');
  } catch (err) {
    console.error('Erro ao verificar tabelas:', err);
  } finally {
    // Fechar a conexão
    await client.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

// Executar a função principal
main();