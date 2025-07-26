import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiModule } from '../gemini/gemini.module';
import { ScraperModule } from '../scraper/scraper.module';
import { User } from '../user/entities/user.entity';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { ArticleLike } from './entities/article-like.entity';
import { AnalyzeArticleUrlUseCase } from './use-cases/analyze-article-url.usecase';
import { CreateArticleUseCase } from './use-cases/create-article.usecase';
import { DeleteArticleUseCase } from './use-cases/delete-article.usecase';
import { GetAllArticlesUseCase } from './use-cases/get-all-articles.usecase';
import { GetArticleUseCase } from './use-cases/get-article.usecase';
import { GetLikedArticlesUseCase } from './use-cases/get-liked-articles.usecase';
import { LikeArticleUseCase } from './use-cases/like-article.usecase';
import { UnlikeArticleUseCase } from './use-cases/unlike-article.usecase';

@Module({
	imports: [
		ScraperModule,
		GeminiModule,
		TypeOrmModule.forFeature([Article, ArticleLike, User]),
		ScheduleModule.forRoot(),
	],
	controllers: [ArticleController],
	providers: [
		CreateArticleUseCase,
		AnalyzeArticleUrlUseCase,
		GetAllArticlesUseCase,
		GetArticleUseCase,
		LikeArticleUseCase,
		UnlikeArticleUseCase,
		GetLikedArticlesUseCase,
		DeleteArticleUseCase,
	],
})
export class ArticleModule {}
