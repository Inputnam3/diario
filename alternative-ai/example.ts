#!/usr/bin/env node

/**
 * Exemplo de uso dos serviços de IA alternativos
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
config();

// Simula um serviço de configuração
class MockConfigService {
  get(key: string): string | undefined {
    // Primeiro tenta do process.env, depois do arquivo .env
    return process.env[key] || undefined;
  }
}

async function main() {
  console.log('=== Exemplo de Serviços de IA Alternativos ===\n');
  
  // Verifica credenciais configuradas
  console.log('Verificando credenciais configuradas:');
  console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✓ Configurado' : '✗ Não configurado');
  console.log('AZURE_COMPUTER_VISION_ENDPOINT:', process.env.AZURE_COMPUTER_VISION_ENDPOINT ? '✓ Configurado' : '✗ Não configurado');
  console.log('AZURE_COMPUTER_VISION_KEY:', process.env.AZURE_COMPUTER_VISION_KEY ? '✓ Configurado' : '✗ Não configurado');
  console.log('SPOONACULAR_API_KEY:', process.env.SPOONACULAR_API_KEY ? '✓ Configurado' : '✗ Não configurado');
  console.log('EDAMAM_APP_ID:', process.env.EDAMAM_APP_ID ? '✓ Configurado' : '✗ Não configurado');
  console.log('EDAMAM_APP_KEY:', process.env.EDAMAM_APP_KEY ? '✓ Configurado' : '✗ Não configurado');
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Inicializa os serviços
  const configService = new MockConfigService();
  
  try {
    console.log('1. Processando mensagem de texto:');
    console.log('Para testar completamente, configure as credenciais das APIs necessárias.');
    console.log('Exemplo de processamento de texto: "Comi 200g de frango grelhado com 150g de arroz branco"');
    
    // Simular resultado
    const mockFoods = [
      { food: 'frango', quantity: 200, unit: 'g', calories: 330, protein: 62, carbs: 0, fat: 7 },
      { food: 'arroz', quantity: 150, unit: 'g', calories: 195, protein: 4, carbs: 42, fat: 0.5 }
    ];
    
    console.log('\nAlimentos identificados:');
    mockFoods.forEach(food => {
      console.log(`  - ${food.food}: ${food.quantity}${food.unit} (${food.calories} kcal)`);
    });
    
    const totalCalories = mockFoods.reduce((sum, food) => sum + food.calories, 0);
    console.log(`\nTotal de calorias: ${totalCalories} kcal`);
    
  } catch (error: any) {
    console.error('Erro durante a execução do exemplo:', error.message);
  }
  
  console.log('\n=== Fim do exemplo ===');
}

// Executa o exemplo
if (require.main === module) {
  main().catch(error => {
    console.error('Erro durante a execução do exemplo:', error);
    process.exit(1);
  });
}

export { MockConfigService };
