import { Logger } from '@nestjs/common';
// @ts-ignore
import vision from '@google-cloud/vision';

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

export class GoogleVisionService {
  private readonly logger = new Logger(GoogleVisionService.name);
  private client: any;

  constructor() {
    try {
      // Inicializa o cliente do Google Vision
      // Requer variável de ambiente GOOGLE_APPLICATION_CREDENTIALS
      this.client = new (vision as any).ImageAnnotatorClient();
    } catch (error) {
      this.logger.error('Erro ao inicializar Google Vision Client:', error);
    }
  }

  async detectFoodInImage(imageBuffer: Buffer): Promise<FoodDetectionResult[]> {
    try {
      if (!this.client) {
        throw new Error('Google Vision Client não inicializado');
      }

      // Realiza detecção de labels na imagem
      const [result] = await this.client.labelDetection(imageBuffer);
      const labels = result.labelAnnotations || [];

      // Filtra labels que podem ser relacionadas a alimentos
      const foodLabels = labels
        .filter((label: any) => {
          const description = label.description?.toLowerCase() || '';
          return this.isFoodRelated(description) && (label.score || 0) > 0.7;
        })
        .map((label: any) => ({
          name: label.description || 'Unknown',
          confidence: label.score || 0
        }));

      this.logger.log(`Alimentos detectados: ${foodLabels.length}`);
      return foodLabels;
    } catch (error) {
      this.logger.error('Erro ao detectar alimentos na imagem:', error);
      throw new Error('Falha ao processar imagem com Google Vision');
    }
  }

  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      if (!this.client) {
        throw new Error('Google Vision Client não inicializado');
      }

      // Realiza OCR (reconhecimento de texto) na imagem
      const [result] = await this.client.textDetection(imageBuffer);
      const detections = result.textAnnotations || [];
      
      // O primeiro elemento contém todo o texto da imagem
      return detections[0]?.description || '';
    } catch (error) {
      this.logger.error('Erro ao extrair texto da imagem:', error);
      throw new Error('Falha ao realizar OCR na imagem');
    }
  }

  private isFoodRelated(description: string): boolean {
    // Lista de palavras-chave relacionadas a alimentos
    const foodKeywords = [
      'food', 'comida', 'alimento', 'meal', 'refeição',
      'fruit', 'fruta', 'vegetable', 'vegetal', 'carne', 'meat',
      'arroz', 'rice', 'feijão', 'bean', 'pão', 'bread',
      'frango', 'chicken', 'peixe', 'fish', 'salad', 'salada',
      'apple', 'maçã', 'banana', 'laranja', 'orange',
      'prato', 'dish', 'bebida', 'drink'
    ];

    return foodKeywords.some(keyword => description.includes(keyword));
  }
}