import { Module } from '@nestjs/common';
import { WEB_CONTENT_SCRAPER } from './interfaces/web-content-scraper.interface';
import { WebContentScraperService } from './services/web-content-scraper.service';

@Module({
	providers: [
		{
			provide: WEB_CONTENT_SCRAPER,
			useClass: WebContentScraperService,
		},
	],
	exports: [WEB_CONTENT_SCRAPER],
})
export class ScraperModule {}
