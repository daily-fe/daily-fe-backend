import { GeminiModel } from '../enums/gemini-model.enum';

export const GEMINI_SERVICE = 'IGeminiService';

export interface IGeminiService {
	generateContent(prompt: string, model: GeminiModel): Promise<string>;
}
