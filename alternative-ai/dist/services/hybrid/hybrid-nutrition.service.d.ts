import { ConfigService } from '@nestjs/config';
export interface NutritionInfo {
    food: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}
export declare class HybridNutritionService {
    private readonly logger;
    private readonly spoonacularApiKey;
    private readonly edamamAppId;
    private readonly edamamAppKey;
    constructor(configService: ConfigService);
    extractNutritionFromText(message: string): Promise<NutritionInfo[]>;
    private extractWithSpoonacular;
    private extractWithEdamam;
    private extractWithRules;
    private estimateNutrition;
    generateNutritionSummary(nutritionData: NutritionInfo[]): string;
}
//# sourceMappingURL=hybrid-nutrition.service.d.ts.map