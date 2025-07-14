import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RSS_FEEDS } from '../config/rss-feeds';
import { ArticleSummary, IWebFeedScraper } from '../interfaces/web-content-scraper.interface';
import { parseFeed } from './feed-parser';

const AXIOS_HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	Accept: 'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
};

@Injectable()
export class GenericFeedScraperService implements IWebFeedScraper {
	async scrapeFeeds(): Promise<ArticleSummary[]> {
		const allArticles: ArticleSummary[] = [];
		for (const feed of RSS_FEEDS) {
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
