import { Feed } from '../entities/feed.entity';

export class FeedResponseDto {
  url: string;
  title: string;
  publishedAt: Date | null;
  site?: string;

  constructor(feed: Feed) {
    this.url = feed.url;
    this.title = feed.title;
    this.publishedAt = feed.publishedAt;
    this.site = feed.site;
  }
}
