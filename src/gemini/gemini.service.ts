import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiModel } from './enums/gemini-model.enum';
import { IGeminiService } from './interfaces/gemini.interface';

@Injectable()
export class GeminiService implements IGeminiService {
	private readonly genAI: GoogleGenerativeAI;

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get<string>('GEMINI_API_KEY');
		if (!apiKey) {
			throw new Error('GEMINI_API_KEY가 존재하지 않습니다.');
		}
		this.genAI = new GoogleGenerativeAI(apiKey);
	}

	async generateContent(prompt: string, model: GeminiModel): Promise<string> {
		try {
			const generativeModel = this.genAI.getGenerativeModel({
				model,
				generationConfig: {
					responseMimeType: 'application/json',
				},
			});

			const result = await generativeModel.generateContent(prompt);
			const responseText = result.response.text();
			return responseText;
		} catch (error) {
			console.error('gemini service generateContent error:', error);
			throw new InternalServerErrorException('Gemini API 통신 중 오류가 발생했습니다.');
		}
	}
}
