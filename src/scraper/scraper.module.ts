import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { FeedSource } from 'src/feed/entities/feed-source.entity';
import { WEB_CONTENT_SCRAPER, WEB_FEED_SCRAPER } from './interfaces/web-content-scraper.interface';
import { ScraperController } from './scraper.controller';
import { GenericFeedScraperService } from './services/generic-feed-scraper.service';
import { WebContentScraperService } from './services/web-content-scraper.service';
import { GetArticlesUseCase } from './use-cases/get-articles.usecase';
import { ScrapeFeedsUseCase } from './use-cases/scrape-feeds.usecase';
import { ScrapePageContentUseCase } from './use-cases/scrape-page-content.usecase';

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
		WebContentScraperService,
		GenericFeedScraperService,
		ScrapeFeedsUseCase,
		GetArticlesUseCase,
		ScrapePageContentUseCase,
	],
	controllers: [ScraperController],
	exports: [
		WEB_CONTENT_SCRAPER,
		WEB_FEED_SCRAPER,
		WebContentScraperService,
		GenericFeedScraperService,
		ScrapeFeedsUseCase,
		GetArticlesUseCase,
		ScrapePageContentUseCase,
	],
})
export class ScraperModule {}
