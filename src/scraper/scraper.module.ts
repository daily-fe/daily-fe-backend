import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { FeedSource } from 'src/feed/entities/feed-source.entity';
import { WEB_CONTENT_SCRAPER, WEB_FEED_SCRAPER } from './interfaces/web-content-scraper.interface';
import { ScraperController } from './scraper.controller';
import { GenericFeedScraperService } from './services/generic-feed-scraper.service';
import { WebContentScraperService } from './services/web-content-scraper.service';

@Module({
	imports: [TypeOrmModule.forFeature([Article, Feed, FeedSource])],
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
