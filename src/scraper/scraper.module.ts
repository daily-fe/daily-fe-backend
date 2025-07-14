import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { GenericFeedScraperService } from './services/generic-feed-scraper.service';
import { WebContentScraperService } from './services/web-content-scraper.service';

@Module({
	providers: [WebContentScraperService, GenericFeedScraperService],
	controllers: [ScraperController],
	exports: [WebContentScraperService],
})
export class ScraperModule {}
