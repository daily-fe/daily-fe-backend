import { Controller, Get, Inject } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { WEB_CONTENT_SCRAPER } from './interfaces/web-content-scraper.interface';
import { WebContentScraperService } from './services/web-content-scraper.service';

@Controller('scraper')
export class ScraperController {
	constructor(
		@Inject(WEB_CONTENT_SCRAPER)
		private readonly scraperService: WebContentScraperService,
	) {}

	@Public()
	@Get('latest-articles')
	// DB에서 최신 기사 목록 반환
	async getAllLatestArticles() {
		return await this.scraperService.scrapeFeeds();
	}
}
