export const WEB_CONTENT_SCRAPER = 'IWebContentScraper';

export interface WebContentScraper {
	fetchLatestArticles(): Promise<ArticleSummary[]>;
}

export interface ArticleSummary {
	title: string;
	url: string;
	publishedAt?: string;
	site: string;
}
