import { Feed } from '../entities/feed.entity';

export class FeedResponseDto {
	url: string;
	title: string;
	publishedAt: Date | null;
	site?: string;
	totalCount?: number; // totalCount 필드 추가

	constructor(feed: Feed, totalCount?: number) {
		this.url = feed.url;
		this.title = feed.title;
		this.publishedAt = feed.publishedAt;
		this.site = feed.site;
		if (totalCount !== undefined) {
			this.totalCount = totalCount;
		}
	}
}
