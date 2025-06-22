import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { GeminiModule } from './gemini/gemini.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		GeminiModule,
		ScraperModule,
		BlogModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
