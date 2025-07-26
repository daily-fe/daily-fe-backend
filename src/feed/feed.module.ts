import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperModule } from '../scraper/scraper.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Feed } from './entities/feed.entity';
import { FeedSource } from './entities/feed-source.entity';
import { FeedController } from './feed.controller';
import { FeedSourceController } from './feed-source.controller';
import { FeedScrapingScheduler } from './scheduler/feed-scraping.scheduler';
import { CreateFeedSourceUseCase } from './use-cases/feed-source/create-feed-source.usecase';
import { FindAllFeedSourcesUseCase } from './use-cases/feed-source/find-all-feed-sources.usecase';
import { RemoveFeedSourceUseCase } from './use-cases/feed-source/remove-feed-source.usecase';
import { UpdateFeedSourceUseCase } from './use-cases/feed-source/update-feed-source.usecase';
import { GetAllFeedsUseCase } from './use-cases/get-all-feeds.usecase';
import { ScrapeAndSaveFeedsUseCase } from './use-cases/scrape-and-save-feeds.usecase';

@Module({
	imports: [TypeOrmModule.forFeature([Feed, FeedSource, User]), ScraperModule, UserModule],
	providers: [
		ScrapeAndSaveFeedsUseCase,
		FeedScrapingScheduler,
		GetAllFeedsUseCase,
		FindAllFeedSourcesUseCase,
		CreateFeedSourceUseCase,
		UpdateFeedSourceUseCase,
		RemoveFeedSourceUseCase,
	],
	controllers: [FeedController, FeedSourceController],
	exports: [
		ScrapeAndSaveFeedsUseCase,
		FeedScrapingScheduler,
		GetAllFeedsUseCase,
		FindAllFeedSourcesUseCase,
		CreateFeedSourceUseCase,
		UpdateFeedSourceUseCase,
		RemoveFeedSourceUseCase,
	],
})
export class FeedModule {}
