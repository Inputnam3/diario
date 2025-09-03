import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface NutritionInfo {
  food: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export class HybridNutritionService {
  private readonly logger = new Logger(HybridNutritionService.name);
  private readonly spoonacularApiKey: string;
  private readonly edamamAppId: string;
  private readonly edamamAppKey: string;

  constructor(configService: ConfigService) {
    this.spoonacularApiKey = configService.get<string>('SPOONACULAR_API_KEY') || '';
    this.edamamAppId = configService.get<string>('EDAMAM_APP_ID') || '';
    this.edamamAppKey = configService.get<string>('EDAMAM_APP_KEY') || '';
  }

  async extractNutritionFromText(message: string): Promise<NutritionInfo[]> {
    try {
      // Primeiro, tenta usar Spoonacular
      if (this.spoonacularApiKey) {
        return await this.extractWithSpoonacular(message);
      }
      
      // Se não tiver Spoonacular, tenta Edamam
      if (this.edamamAppId && this.edamamAppKey) {
        return await this.extractWithEdamam(message);
      }
      
      // Se não tiver nenhuma API, usa regras básicas
      return this.extractWithRules(message);
    } catch (error) {
      this.logger.error('Erro ao extrair informações nutricionais:', error);
      // Fallback para regras básicas
      return this.extractWithRules(message);
    }
  }

  private async extractWithSpoonacular(message: string): Promise<NutritionInfo[]> {
    try {
      const response = await axios.post(
        `https://api.spoonacular.com/food/detect`,
        { text: message },
        { headers: { 'x-api-key': this.spoonacularApiKey } }
      );

      const detectedFoods = response.data.annotations || [];
      const nutritionData: NutritionInfo[] = [];

      for (const food of detectedFoods) {
        // Obtém informações nutricionais detalhadas
        const nutritionResponse = await axios.get(
          `https://api.spoonacular.com/food/ingredients/${food.id}/information?amount=${food.amount}&unit=${food.unit}`,
          { headers: { 'x-api-key': this.spoonacularApiKey } }
        );

        const info = nutritionResponse.data;
        nutritionData.push({
          food: info.name,
          quantity: food.amount,
          unit: food.unit,
          calories: info.nutrition.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0,
          protein: info.nutrition.nutrients.find((n: any) => n.name === 'Protein')?.amount || 0,
          carbs: info.nutrition.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
          fat: info.nutrition.nutrients.find((n: any) => n.name === 'Fat')?.amount || 0
        });
      }

      return nutritionData;
    } catch (error) {
      this.logger.error('Erro ao usar Spoonacular:', error);
      throw error;
    }
  }

  private async extractWithEdamam(message: string): Promise<NutritionInfo[]> {
    try {
      const response = await axios.post(
        `https://api.edamam.com/api/nutrition-details?app_id=${this.edamamAppId}&app_key=${this.edamamAppKey}`,
        { ingr: [message] }
      );

      const ingredients = response.data.ingredients || [];
      return ingredients.map((ing: any) => ({
        food: ing.parsed[0]?.food || 'Unknown',
        quantity: ing.parsed[0]?.quantity || 100,
        unit: ing.parsed[0]?.measure || 'g',
        calories: ing.calories || 0,
        protein: ing.totalNutrients?.PROCNT?.quantity || 0,
        carbs: ing.totalNutrients?.CHOCDF?.quantity || 0,
        fat: ing.totalNutrients?.FAT?.quantity || 0
      }));
    } catch (error) {
      this.logger.error('Erro ao usar Edamam:', error);
      throw error;
    }
  }

  private extractWithRules(message: string): NutritionInfo[] {
    // Regras básicas para extrair informações nutricionais
    const nutritionData: NutritionInfo[] = [];
    
    // Extrai padrões como "100g de frango", "2 bananas", etc.
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(g|kg|ml|l|unidades?|peças?|pedaços?)\s+de\s+([\w\s]+)/gi,
      /(\d+(?:\.\d+)?)\s*([\w\s]+)/gi
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(message)) !== null) {
        const quantity = parseFloat(match[1]);
        const unit = match[2] || 'g';
        const food = match[3] || match[2];
        
        if (food) {
          // Usa valores nutricionais estimados
          const estimatedNutrition = this.estimateNutrition(food, quantity, unit);
          nutritionData.push({
            food: food.trim(),
            quantity,
            unit,
            ...estimatedNutrition
          });
        }
      }
    }

    return nutritionData;
  }

  private estimateNutrition(food: string, quantity: number, unit: string): Omit<NutritionInfo, 'food' | 'quantity' | 'unit'> {
    // Banco de dados simplificado de valores nutricionais
    const nutritionDatabase: Record<string, any> = {
      'frango': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      'arroz': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
      'feijão': { calories: 330, protein: 21, carbs: 60, fat: 1.4 },
      'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
      'maçã': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
      'carne': { calories: 250, protein: 26, carbs: 0, fat: 15 },
      'peixe': { calories: 206, protein: 22, carbs: 0, fat: 12 }
    };

    // Normaliza o nome do alimento
    const normalizedFood = food.toLowerCase().trim();
    const baseNutrition = Object.keys(nutritionDatabase).find(
      key => normalizedFood.includes(key)
    );

    if (baseNutrition) {
      const base = nutritionDatabase[baseNutrition];
      // Ajusta as quantidades conforme a quantidade informada (baseado em 100g)
      const adjustment = unit === 'g' ? quantity / 100 : quantity;
      
      return {
        calories: base.calories * adjustment,
        protein: base.protein * adjustment,
        carbs: base.carbs * adjustment,
        fat: base.fat * adjustment
      };
    }

    // Valores padrão se não encontrar o alimento
    return {
      calories: quantity * 1.5, // Estimativa genérica
      protein: quantity * 0.05,
      carbs: quantity * 0.1,
      fat: quantity * 0.02
    };
  }

  generateNutritionSummary(nutritionData: NutritionInfo[]): string {
    if (!nutritionData || nutritionData.length === 0) {
      return 'Não foi possível identificar informações nutricionais na sua mensagem. Por favor, descreva os alimentos consumidos, por exemplo: "Comi 200g de arroz, 100g de feijão e 1 bife".';
    }

    const total = nutritionData.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return `🔹 *Resumo Nutricional* 🔹\n\n` +
      `🔥 Calorias: ${total.calories.toFixed(0)} kcal\n` +
      `💪 Proteínas: ${total.protein.toFixed(1)}g\n` +
      `🍞 Carboidratos: ${total.carbs.toFixed(1)}g\n` +
      `🥑 Gorduras: ${total.fat.toFixed(1)}g\n\n` +
      `_*Itens consumidos:*_\n` +
      nutritionData
        .map(
          (item) =>
            `• ${item.quantity}${item.unit} de ${item.food}: ${item.calories.toFixed(0)} kcal`
        )
        .join('\n');
  }
}