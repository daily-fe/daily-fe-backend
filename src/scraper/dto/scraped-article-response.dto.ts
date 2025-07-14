export class ScrapedArticleResponseDto {
  title: string;
  url: string;
  publishedAt?: string;
  site?: string;

  constructor(article: any) {
    this.title = article.title;
    this.url = article.url;
    this.publishedAt = article.publishedAt;
    this.site = article.site;
  }
}
