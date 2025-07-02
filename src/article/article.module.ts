import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiModule } from 'src/gemini/gemini.module';
import { ScraperModule } from 'src/scraper/scraper.module';
import { User } from 'src/user/entities/user.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { ArticleLike } from './entities/article-like.entity';

@Module({
	imports: [ScraperModule, GeminiModule, TypeOrmModule.forFeature([Article, ArticleLike, User])],
	controllers: [ArticleController],
	providers: [ArticleService],
})
export class ArticleModule {}
