import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleSummary, WEB_CONTENT_SCRAPER } from '../../scraper/interfaces/web-content-scraper.interface';
import { WebContentScraperService } from '../../scraper/services/web-content-scraper.service';
import { Feed } from '../entities/feed.entity';

@Injectable()
export class ScrapeAndSaveFeedsUseCase {
	constructor(
		@Inject(WEB_CONTENT_SCRAPER)
		private readonly webContentScraper: WebContentScraperService,
		@InjectRepository(Feed)
		private readonly feedRepository: Repository<Feed>,
	) {}

	async execute(): Promise<number> {
		const feeds: ArticleSummary[] = await this.webContentScraper.scrapeFeeds();
		let savedCount = 0;
		for (const feed of feeds) {
			const exists = await this.feedRepository.findOne({ where: { url: feed.url } });
			if (!exists) {
				const entity = Feed.create(
					feed.url,
					feed.title,
					feed.publishedAt ? new Date(feed.publishedAt) : new Date(),
					feed.site,
				);
				await this.feedRepository.save(entity);
				savedCount++;
			}
		}
		return savedCount;
	}
}
