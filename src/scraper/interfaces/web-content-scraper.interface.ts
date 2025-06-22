export const WEB_CONTENT_SCRAPER = 'IWebContentScraper';

export interface IWebContentScraper {
	scrape(url: string): Promise<string>;
}
