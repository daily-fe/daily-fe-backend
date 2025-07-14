import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { WebContentScraperService } from './services/web-content-scraper.service';

@Controller('scraper')
export class ScraperController {
	constructor(private readonly scraperService: WebContentScraperService) {}

	@Public()
	@Get('latest-articles')
	async getAllLatestArticles() {
		return await this.scraperService.fetchAllLatestArticles();
	}
}
