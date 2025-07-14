import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Req,
	UseGuards,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { AnalyzeArticleUrlDto } from './dto/analyze-article-url.dto';
import { ArticleCreateInput } from './dto/article-create-input.dto';
import { ArticleGetAllInputDto } from './dto/article-get-all-input.dto';
import { ArticleResponse } from './dto/article-response.dto';
import { AnalyzeArticleUrlUseCase } from './use-cases/analyze-article-url.usecase';
import { CreateArticleUseCase } from './use-cases/create-article.usecase';
import { GetAllArticlesUseCase } from './use-cases/get-all-articles.usecase';
import { GetArticleUseCase } from './use-cases/get-article.usecase';
import { GetLikedArticlesUseCase } from './use-cases/get-liked-articles.usecase';
import { LikeArticleUseCase } from './use-cases/like-article.usecase';
import { UnlikeArticleUseCase } from './use-cases/unlike-article.usecase';

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
	constructor(
		private readonly analyzeArticleUrlUseCase: AnalyzeArticleUrlUseCase,
		private readonly createArticleUseCase: CreateArticleUseCase,
		private readonly getAllArticlesUseCase: GetAllArticlesUseCase,
		private readonly getArticleWithLikesUseCase: GetArticleUseCase,
		private readonly likeArticleUseCase: LikeArticleUseCase,
		private readonly unlikeArticleUseCase: UnlikeArticleUseCase,
		private readonly getLikedArticlesUseCase: GetLikedArticlesUseCase,
	) {}

	@Post('analyze')
	@UseGuards(JwtAuthGuard)
	async analyzeArticleWebsite(
		@Body(new ValidationPipe({ transform: true })) analyzeArticleUrlDto: AnalyzeArticleUrlDto,
		@Req() req,
	): Promise<ArticleResponse> {
		const userId = req.user?.id;
		const result = await this.analyzeArticleUrlUseCase.execute(analyzeArticleUrlDto.url, userId);
		return result.toResponse(false);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	async createArticle(@Body() dto: ArticleCreateInput, @Req() req): Promise<ArticleResponse> {
		const userId = req.user?.id;
		return this.createArticleUseCase.execute(dto, userId);
	}

	@Get()
	@Public()
	@UseGuards(OptionalAuthGuard)
	async getAllArticles(@Query() input: ArticleGetAllInputDto, @Req() req): Promise<ArticleResponse[]> {
		const userId = req.user?.id;
		return this.getAllArticlesUseCase.execute(input, userId);
	}

	@Get('liked')
	@UseGuards(JwtAuthGuard)
	async getLikedArticles(@Req() req): Promise<ArticleResponse[]> {
		const userId = req.user?.id;
		console.log('userId', userId);
		return this.getLikedArticlesUseCase.execute(userId);
	}

	@Get(':id')
	@UseGuards(OptionalAuthGuard)
	async getArticle(@Param('id') id: string, @Req() req): Promise<ArticleResponse> {
		const userId = req.user?.id;
		return this.getArticleWithLikesUseCase.execute(id, userId);
	}

	@Post(':id/like')
	async likeArticle(@Param('id') id: string, @Req() req): Promise<ArticleResponse> {
		const userId = req.user?.id;
		return this.likeArticleUseCase.execute(id, userId);
	}

	@Delete(':id/like')
	async unlikeArticle(@Param('id') id: string, @Req() req): Promise<ArticleResponse> {
		const userId = req.user?.id;
		return this.unlikeArticleUseCase.execute(id, userId);
	}
}
