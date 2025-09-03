const { Client } = require('pg');

// Carregar variáveis de ambiente do .env do backend
require('dotenv').config({ path: './backend/.env' });

// Configurações do banco de dados
const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Função principal
async function main() {
  const client = new Client(dbConfig);
  
  try {
    // Conectar ao banco de dados
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso.');
    
    // Verificar se RLS está habilitado para as tabelas
    const tables = ['profiles', 'consumptions', 'nutrition_goals'];
    
    for (const table of tables) {
      console.log(`\n--- Verificando RLS para a tabela ${table} ---`);
      
      // Verificar se RLS está habilitado
      const rlsRes = await client.query(`
        SELECT relname, relrowsecurity
        FROM pg_class
        WHERE relname = $1 AND relrowsecurity = true;
      `, [table]);
      
      if (rlsRes.rows.length > 0) {
        console.log(`RLS está habilitado para a tabela ${table}.`);
      } else {
        console.log(`RLS não está habilitado para a tabela ${table}.`);
      }
      
      // Verificar políticas RLS
      console.log('\nPolíticas RLS:');
      const policiesRes = await client.query(`
        SELECT polname, polpermissive, polroles, polcmd, polqual, polwithcheck
        FROM pg_policy
        WHERE polrelid = (SELECT oid FROM pg_class WHERE relname = $1);
      `, [table]);
      
      if (policiesRes.rows.length > 0) {
        policiesRes.rows.forEach(row => {
          console.log(`  - ${row.polname}: ${row.polcmd} (${row.polpermissive ? 'PERMISSIVE' : 'RESTRICTIVE'})`);
          console.log(`    Roles: ${row.polroles}`);
          console.log(`    Qual: ${row.polqual}`);
          if (row.polwithcheck) {
            console.log(`    With Check: ${row.polwithcheck}`);
          }
        });
      } else {
        console.log('  Nenhuma política RLS encontrada.');
      }
    }
    
    console.log('\n--- Verificação concluída ---');
  } catch (err) {
    console.error('Erro ao verificar RLS:', err);
  } finally {
    // Fechar a conexão
    await client.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

// Executar a função principal
main();