export class BlogContentAnalysis {
	constructor(
		public readonly title: string,
		public readonly summary: string,
		public readonly tags: string[],
		public readonly author: string,
		public readonly createdAt?: Date,
	) {}

	static create(
		title: string,
		summary: string,
		tags: string[],
		author: string,
		createdAt: Date,
	): BlogContentAnalysis {
		let date: Date | undefined = new Date(createdAt);
		if (Number.isNaN(date.getTime())) {
			date = undefined;
		}
		return new BlogContentAnalysis(title, summary, tags, author, date);
	}

	toResponse() {
		return {
			title: this.title,
			summary: this.summary,
			tags: this.tags,
			author: this.author,
			createdAt: this.createdAt,
		};
	}
}
