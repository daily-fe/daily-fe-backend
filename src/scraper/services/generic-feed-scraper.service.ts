import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { FeedSource } from 'src/feed/entities/feed-source.entity';
import { Repository } from 'typeorm';
import { ArticleSummary, IWebFeedScraper } from '../interfaces/web-content-scraper.interface';
import { parseFeed } from './feed-parser';

const AXIOS_HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	Accept: 'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
};

@Injectable()
export class GenericFeedScraperService implements IWebFeedScraper {
	constructor(
		@InjectRepository(FeedSource)
		private readonly feedSourceRepository: Repository<FeedSource>,
	) {}

	async scrapeFeeds(): Promise<ArticleSummary[]> {
		const allArticles: ArticleSummary[] = [];
		const feedSources = await this.feedSourceRepository.find({ where: { isActive: true } });
		for (const feed of feedSources) {
			try {
				const res = await axios.get(feed.url, { headers: AXIOS_HEADERS });
				const articles = parseFeed(res.data)
					.slice(0, 5)
					.map((article) => ({
						...article,
						site: feed.site,
					}));
				allArticles.push(...articles);
			} catch (e) {
				console.error(e);
			}
		}
		return allArticles;
	}
}
