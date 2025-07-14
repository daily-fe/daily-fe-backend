export class ArticleResponse {
	id: string;
	url: string;
	title: string;
	summary: string;
	tags: string[];
	author: string | null;
	createdAt: Date | null;
	category: string;
	likes: number;
	likedByMe: boolean;
	createdBy: {
		id: number;
		username: string;
		avatarUrl: string | null;
	};
}
