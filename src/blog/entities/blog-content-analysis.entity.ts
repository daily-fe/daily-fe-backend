export class BlogContentAnalysis {
	constructor(
		public readonly url: string,
		public readonly title: string,
		public readonly summary: string,
		public readonly tags: string[],
		public readonly author: string | null,
		public readonly createdAt: Date | null,
		public readonly category: string,
		public readonly likes: number,
	) {}

	static create(
		url: string,
		title: string,
		summary: string,
		tags: string[],
		author: string,
		createdAt: Date,
		category: string,
	): BlogContentAnalysis {
		let date: Date | null = new Date(createdAt);
		if (Number.isNaN(date.getTime())) {
			date = null;
		}
		return new BlogContentAnalysis(url, title, summary, tags, author, date, category, 0);
	}

	toResponse() {
		return {
			url: this.url,
			title: this.title,
			summary: this.summary,
			tags: this.tags,
			author: this.author,
			createdAt: this.createdAt,
			category: this.category,
			likes: this.likes,
		};
	}
}
