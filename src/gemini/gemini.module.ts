import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { GEMINI_SERVICE } from './interfaces/gemini.interface';

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: GEMINI_SERVICE,
			useClass: GeminiService,
		},
	],
	exports: [GEMINI_SERVICE],
})
export class GeminiModule {}
