import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { ScrapedArticleResponseDto } from './dto/scraped-article-response.dto';
import { ScrapeFeedsUseCase } from './use-cases/scrape-feeds.usecase';

@Controller('scraper')
export class ScraperController {
	constructor(private readonly scrapeFeedsUseCase: ScrapeFeedsUseCase) {}

	@Public()
	@Get('latest-articles')
	// DB에서 최신 기사 목록 반환
	async getAllLatestArticles(): Promise<ScrapedArticleResponseDto[]> {
		const articles = await this.scrapeFeedsUseCase.execute();
		return articles.map((a) => new ScrapedArticleResponseDto(a));
	}
}
