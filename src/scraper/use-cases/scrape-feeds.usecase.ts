import { Injectable } from '@nestjs/common';
import { WebContentScraperService } from '../services/web-content-scraper.service';

@Injectable()
export class ScrapeFeedsUseCase {
	constructor(private readonly webContentScraperService: WebContentScraperService) {}

	async execute() {
		return this.webContentScraperService.scrapeFeeds();
	}
}
