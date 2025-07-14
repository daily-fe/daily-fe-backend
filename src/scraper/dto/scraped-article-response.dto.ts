import { ArticleSummary } from '../interfaces/web-content-scraper.interface';

export class ScrapedArticleResponseDto {
	title: string;
	url: string;
	publishedAt?: string;
	site?: string;

	constructor(article: ArticleSummary) {
		this.title = article.title;
		this.url = article.url;
		this.publishedAt = article.publishedAt;
		this.site = article.site;
	}
}
