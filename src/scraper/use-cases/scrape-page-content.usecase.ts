import { Injectable } from '@nestjs/common';
import { WebContentScraperService } from '../services/web-content-scraper.service';

@Injectable()
export class ScrapePageContentUseCase {
	constructor(private readonly webContentScraperService: WebContentScraperService) {}

	async execute(url: string) {
		return this.webContentScraperService.scrapePageContent(url);
	}
}
