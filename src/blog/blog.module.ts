import { Module } from '@nestjs/common';
import { GeminiModule } from 'src/gemini/gemini.module';
import { ScraperModule } from 'src/scraper/scraper.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
	imports: [ScraperModule, GeminiModule],
	controllers: [BlogController],
	providers: [BlogService],
})
export class BlogModule {}
