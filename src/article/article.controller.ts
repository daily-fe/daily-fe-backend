import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { ArticleService } from './article.service';
import { AnalyzeArticleUrlDto } from './dto/analyze-article-url.dto';

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post('analyze')
	async analyzeArticleWebsite(
		@Body(new ValidationPipe({ transform: true })) analyzeArticleUrlDto: AnalyzeArticleUrlDto,
	) {
		const result = await this.articleService.analyzeUrl(analyzeArticleUrlDto.url);
		return result.toResponse(false);
	}

	@Post()
	async createArticle(@Body() dto: AnalyzeArticleUrlDto) {
		return this.articleService.createArticle(dto.url);
	}

	@Get()
	@Public()
	@UseGuards(OptionalAuthGuard)
	async getAllArticles(@Req() req) {
		const userId = req.user?.id;
		return this.articleService.getAllArticles(userId);
	}

	@Get(':id')
	@UseGuards(OptionalAuthGuard)
	async getArticle(@Param('id') id: string, @Req() req) {
		const userId = req.user?.id;
		return this.articleService.getArticleWithLikes(id, userId);
	}

	@Post(':id/like')
	async likeArticle(@Param('id') id: string, @Req() req) {
		const userId = req.user?.id;
		return this.articleService.likeArticle(id, userId);
	}

	@Delete(':id/like')
	async unlikeArticle(@Param('id') id: string, @Req() req) {
		const userId = req.user?.id;
		return this.articleService.unlikeArticle(id, userId);
	}
}
