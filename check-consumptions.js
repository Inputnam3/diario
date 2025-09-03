const { Client } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function main() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso.');
    
    // Verificar registros de consumo
    console.log('\n--- Registros de consumo ---');
    const res = await client.query(`
      SELECT c.*, u.email
      FROM consumptions c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.consumed_at DESC
      LIMIT 10;
    `);
    
    if (res.rows.length === 0) {
      console.log('Nenhum registro de consumo encontrado.');
    } else {
      res.rows.forEach(row => {
        console.log(`\nID: ${row.id}`);
        console.log(`  Usuário: ${row.email}`);
        console.log(`  Item: ${row.item}`);
        console.log(`  Quantidade: ${row.quantity} ${row.unit}`);
        console.log(`  Calorias: ${row.calories}`);
        console.log(`  Proteínas: ${row.protein}`);
        console.log(`  Carboidratos: ${row.carbs}`);
        console.log(`  Gorduras: ${row.fat}`);
        console.log(`  Fibra: ${row.fiber}`);
        console.log(`  Micronutrientes: ${row.micronutrients}`);
        console.log(`  Consumido em: ${row.consumed_at}`);
      });
    }
    
    console.log('\n--- Verificação concluída ---');
  } catch (err) {
    console.error('Erro ao verificar registros de consumo:', err);
  } finally {
    await client.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

main();