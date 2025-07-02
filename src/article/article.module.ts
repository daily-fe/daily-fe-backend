import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiModule } from 'src/gemini/gemini.module';
import { ScraperModule } from 'src/scraper/scraper.module';
import { User } from 'src/user/entities/user.entity';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { ArticleLike } from './entities/article-like.entity';
import { AnalyzeArticleUrlUseCase } from './use-cases/analyze-article-url.usecase';
import { CreateArticleUseCase } from './use-cases/create-article.usecase';
import { GetAllArticlesUseCase } from './use-cases/get-all-articles.usecase';
import { GetArticleUseCase } from './use-cases/get-article.usecase';
import { LikeArticleUseCase } from './use-cases/like-article.usecase';
import { UnlikeArticleUseCase } from './use-cases/unlike-article.usecase';

@Module({
	imports: [ScraperModule, GeminiModule, TypeOrmModule.forFeature([Article, ArticleLike, User])],
	controllers: [ArticleController],
	providers: [
		CreateArticleUseCase,
		AnalyzeArticleUrlUseCase,
		GetAllArticlesUseCase,
		GetArticleUseCase,
		LikeArticleUseCase,
		UnlikeArticleUseCase,
	],
})
export class ArticleModule {}
