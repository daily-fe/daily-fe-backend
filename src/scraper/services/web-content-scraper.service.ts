import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Feed } from 'src/feed/entities/feed.entity';
import { Repository } from 'typeorm';
import { ArticleSummary, IWebFeedScraper, WEB_FEED_SCRAPER } from '../interfaces/web-content-scraper.interface';

@Injectable()
export class WebContentScraperService {
	constructor(
		@Inject(WEB_FEED_SCRAPER)
		private readonly genericFeedScraper: IWebFeedScraper,
		@InjectRepository(Feed)
		private readonly feedRepository: Repository<Feed>,
	) {}

	private scrapers: IWebFeedScraper[];

	onModuleInit() {
		this.scrapers = [this.genericFeedScraper];
	}

	async scrapeFeeds(): Promise<ArticleSummary[]> {
		const results = await Promise.all(this.scrapers.map((scraper) => scraper.scrapeFeeds()));
		return results.flat();
	}

	async getArticles(): Promise<ArticleSummary[]> {
		const results = await Promise.all(this.scrapers.map((scraper) => scraper.scrapeFeeds()));
		return results.flat().sort((a, b) => {
			if (!a.publishedAt && !b.publishedAt) return 0;
			if (!a.publishedAt) return 1;
			if (!b.publishedAt) return -1;
			return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
		});
	}

	async scrapePageContent(url: string): Promise<string> {
		try {
			const { data: html } = await axios.get(url, {
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
				},
				timeout: 10000,
			});

			const $ = cheerio.load(html);

			const contentSelectors = [
				'article',
				'.post-content',
				'.entry-content',
				'.blog-content',
				'.content',
				'main',
				'body',
			];
			let textContent = '';
			for (const selector of contentSelectors) {
				const element = $(selector);
				if (element.length > 0) {
					textContent = element.text().replace(/\s\s+/g, ' ').trim();
					if (textContent.length > 300) break;
				}
			}

			if (!textContent || textContent.length < 300) {
				throw new BadRequestException('웹사이트에서 충분한 텍스트 콘텐츠를 추출할 수 없습니다.');
			}

			return textContent;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.code === 'ECONNABORTED') {
					throw new BadRequestException('웹사이트 응답 시간이 초과되었습니다.');
				}
				throw new BadRequestException(`URL로부터 콘텐츠를 가져오는 데 실패했습니다: ${url}`);
			}
			throw new InternalServerErrorException('웹사이트 콘텐츠를 스크래핑하는 중 오류가 발생했습니다.');
		}
	}
}
