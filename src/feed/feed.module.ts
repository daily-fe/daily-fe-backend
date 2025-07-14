import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperModule } from 'src/scraper/scraper.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Feed } from './entities/feed.entity';
import { FeedSource } from './entities/feed-source.entity';
import { FeedController } from './feed.controller';
import { FeedSourceController } from './feed-source.controller';
import { FeedScrapingScheduler } from './scheduler/feed-scraping.scheduler';
import { FeedSourceService } from './services/feed-source.service';
import { GetAllFeedsUseCase } from './use-cases/get-all-feeds.usecase';
import { ScrapeAndSaveFeedsUseCase } from './use-cases/scrape-and-save-feeds.usecase';

@Module({
	imports: [TypeOrmModule.forFeature([Feed, FeedSource, User]), ScraperModule, UserModule],
	providers: [ScrapeAndSaveFeedsUseCase, FeedScrapingScheduler, GetAllFeedsUseCase, Logger, FeedSourceService],
	controllers: [FeedController, FeedSourceController],
	exports: [],
})
export class FeedModule {}
