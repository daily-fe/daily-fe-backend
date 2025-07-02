import { generateBase62Id } from 'src/utils/base62';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ArticleLike } from './article-like.entity';

@Entity()
export class Article {
	@PrimaryColumn()
	url: string;

	@Column({ unique: true })
	id: string;

	@Column()
	title: string;

	@Column()
	summary: string;

	@Column('simple-array')
	tags: string[];

	@Column({ nullable: true, type: 'varchar' })
	author: string | null;

	@Column({ type: 'timestamp', nullable: true })
	createdAt: Date | null;

	@Column()
	category: string;

	@OneToMany(
		() => ArticleLike,
		(like) => like.article,
	)
	likes: ArticleLike[];

	constructor(
		url: string,
		id: string,
		title: string,
		summary: string,
		tags: string[],
		author: string | null,
		createdAt: Date | null,
		category: string,
	) {
		this.url = url;
		this.id = id;
		this.title = title;
		this.summary = summary;
		this.tags = tags;
		this.author = author;
		this.createdAt = createdAt;
		this.category = category;
	}

	static create(
		url: string,
		title: string,
		summary: string,
		tags: string[],
		author: string,
		createdAt: Date,
		category: string,
	): Article {
		let date: Date | null = new Date(createdAt);
		if (Number.isNaN(date.getTime())) {
			date = null;
		}
		const id = generateBase62Id();
		return new Article(url, id, title, summary, tags, author, date, category);
	}

	toResponse(likedByMe: boolean) {
		const likesCount = this.likes?.length ?? 0;

		return {
			id: this.id,
			url: this.url,
			title: this.title,
			summary: this.summary,
			tags: this.tags,
			author: this.author,
			createdAt: this.createdAt,
			category: this.category,
			likes: likesCount,
			likedByMe,
		};
	}
}
