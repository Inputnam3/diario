#!/usr/bin/env node

/**
 * Teste simples para verificar o processamento de texto
 */

import { config } from 'dotenv';
config();

// Função simulada para processar texto
function simulateTextProcessing(message: string) {
  console.log(`Processando mensagem: \"${message}\"`);
  
  // Simular extração de alimentos
  const foods = [
    { food: 'frango', quantity: 200, unit: 'g', calories: 330, protein: 62, carbs: 0, fat: 7 },
    { food: 'arroz', quantity: 150, unit: 'g', calories: 195, protein: 4, carbs: 42, fat: 0.5 }
  ];
  
  console.log('\nAlimentos identificados:');
  foods.forEach(food => {
    console.log(`  - ${food.food}: ${food.quantity}${food.unit} (${food.calories} kcal)`);
  });
  
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  console.log(`\nTotal de calorias: ${totalCalories} kcal`);
  
  return foods;
}

async function main() {
  console.log('=== Teste de Processamento de Texto ===\n');
  
  // Testar com uma mensagem de exemplo
  const testMessage = "Comi 200g de frango grelhado com 150g de arroz branco";
  simulateTextProcessing(testMessage);
  
  console.log('\n=== Teste concluído ===');
}

// Executa o teste
if (require.main === module) {
  main().catch(error => {
    console.error('Erro durante o teste:', error);
    process.exit(1);
  });
}