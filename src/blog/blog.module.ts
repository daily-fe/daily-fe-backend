import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiModule } from 'src/gemini/gemini.module';
import { ScraperModule } from 'src/scraper/scraper.module';
import { User } from 'src/user/entities/user.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogContentAnalysis } from './entities/blog-content-analysis.entity';
import { BlogLike } from './entities/blog-like.entity';

@Module({
	imports: [ScraperModule, GeminiModule, TypeOrmModule.forFeature([BlogContentAnalysis, BlogLike, User])],
	controllers: [BlogController],
	providers: [BlogService],
})
export class BlogModule {}
