import { Module } from '@nestjs/common';
import { WEB_CONTENT_SCRAPER, WEB_FEED_SCRAPER } from './interfaces/web-content-scraper.interface';
import { ScraperController } from './scraper.controller';
import { GenericFeedScraperService } from './services/generic-feed-scraper.service';
import { WebContentScraperService } from './services/web-content-scraper.service';

@Module({
	providers: [
		{
			provide: WEB_CONTENT_SCRAPER,
			useClass: WebContentScraperService,
		},
		{
			provide: WEB_FEED_SCRAPER,
			useClass: GenericFeedScraperService,
		},
	],
	controllers: [ScraperController],
	exports: [WEB_CONTENT_SCRAPER, WEB_FEED_SCRAPER],
})
export class ScraperModule {}
