export const WEB_CONTENT_SCRAPER = 'IWebContentScraper';

export interface IWebContentScraper extends IWebFeedScraper {
	scrape(url: string): Promise<string>;
}

export interface IWebFeedScraper {
	getArticles(): Promise<ArticleSummary[]>;
}

export interface ArticleSummary {
	title: string;
	url: string;
	publishedAt?: string;
	site: string;
}
