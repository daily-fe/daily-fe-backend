import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { GeminiModule } from './gemini/gemini.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		GeminiModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
