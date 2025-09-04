/// <reference types="node" />
/// <reference types="node" />
export interface FoodDetectionResult {
    name: string;
    confidence: number;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export declare class GoogleVisionService {
    private readonly logger;
    private client;
    constructor();
    detectFoodInImage(imageBuffer: Buffer): Promise<FoodDetectionResult[]>;
    extractTextFromImage(imageBuffer: Buffer): Promise<string>;
    private isFoodRelated;
}
//# sourceMappingURL=google-vision.service.d.ts.map