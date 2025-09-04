"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleVisionService = void 0;
const common_1 = require("@nestjs/common");
// @ts-ignore
const vision_1 = __importDefault(require("@google-cloud/vision"));
class GoogleVisionService {
    constructor() {
        this.logger = new common_1.Logger(GoogleVisionService.name);
        try {
            // Inicializa o cliente do Google Vision
            // Requer variável de ambiente GOOGLE_APPLICATION_CREDENTIALS
            this.client = new vision_1.default.ImageAnnotatorClient();
        }
        catch (error) {
            this.logger.error('Erro ao inicializar Google Vision Client:', error);
        }
    }
    async detectFoodInImage(imageBuffer) {
        try {
            if (!this.client) {
                throw new Error('Google Vision Client não inicializado');
            }
            // Realiza detecção de labels na imagem
            const [result] = await this.client.labelDetection(imageBuffer);
            const labels = result.labelAnnotations || [];
            // Filtra labels que podem ser relacionadas a alimentos
            const foodLabels = labels
                .filter((label) => {
                const description = label.description?.toLowerCase() || '';
                return this.isFoodRelated(description) && (label.score || 0) > 0.7;
            })
                .map((label) => ({
                name: label.description || 'Unknown',
                confidence: label.score || 0
            }));
            this.logger.log(`Alimentos detectados: ${foodLabels.length}`);
            return foodLabels;
        }
        catch (error) {
            this.logger.error('Erro ao detectar alimentos na imagem:', error);
            throw new Error('Falha ao processar imagem com Google Vision');
        }
    }
    async extractTextFromImage(imageBuffer) {
        try {
            if (!this.client) {
                throw new Error('Google Vision Client não inicializado');
            }
            // Realiza OCR (reconhecimento de texto) na imagem
            const [result] = await this.client.textDetection(imageBuffer);
            const detections = result.textAnnotations || [];
            // O primeiro elemento contém todo o texto da imagem
            return detections[0]?.description || '';
        }
        catch (error) {
            this.logger.error('Erro ao extrair texto da imagem:', error);
            throw new Error('Falha ao realizar OCR na imagem');
        }
    }
    isFoodRelated(description) {
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
exports.GoogleVisionService = GoogleVisionService;
//# sourceMappingURL=google-vision.service.js.map