export const WEB_CONTENT_SCRAPER = 'IWebContentScraper';
export const WEB_FEED_SCRAPER = 'IWebFeedScraper';

export interface IWebContentScraper extends IWebFeedScraper {
	scrapePageContent(url: string): Promise<string>;
}

export interface IWebFeedScraper {
	scrapeFeeds(): Promise<ArticleSummary[]>;
}

export interface ArticleSummary {
	title: string;
	url: string;
	publishedAt?: string;
	site?: string;
}
