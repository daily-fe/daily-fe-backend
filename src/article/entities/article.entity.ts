import { User } from 'src/user/entities/user.entity';
import { generateBase62Id } from 'src/utils/base62.util';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CATEGORY, Category, SERIES, Series } from '../constants';
import { ArticleResponse } from '../dto/article-response.dto';
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

	@Column({ type: 'enum', enum: SERIES })
	series: Series;

	@Column({ type: 'enum', enum: CATEGORY, nullable: true })
	category?: Category;

	@OneToMany(
		() => ArticleLike,
		(like) => like.article,
	)
	likes: ArticleLike[];

	@ManyToOne(() => User, { eager: true, nullable: false })
	createdBy: User;

	constructor(
		url: string,
		id: string,
		title: string,
		summary: string,
		tags: string[],
		author: string | null,
		createdAt: Date | null,
		series: Series,
		category: Category,
		createdBy: User,
	) {
		this.url = url;
		this.id = id;
		this.title = title;
		this.summary = summary;
		this.tags = tags;
		this.author = author;
		this.createdAt = createdAt;
		this.series = series;
		this.createdBy = createdBy;
		this.category = category;
	}

	static create(
		url: string,
		title: string,
		summary: string,
		tags: string[],
		author: string | null,
		createdAt: Date,
		series: Series,
		category: Category,
		createdBy: User,
	): Article {
		let date: Date | null = new Date(createdAt);
		if (Number.isNaN(date.getTime())) {
			date = null;
		}
		const id = generateBase62Id();
		return new Article(url, id, title, summary, tags, author, date, series, category, createdBy);
	}

	toResponse(likedByMe: boolean): ArticleResponse {
		const likesCount = this.likes?.length ?? 0;
		return {
			id: this.id,
			url: this.url,
			title: this.title,
			summary: this.summary,
			tags: this.tags,
			author: this.author,
			createdAt: this.createdAt,
			series: this.series,
			category: this.category,
			likes: likesCount,
			likedByMe,
			createdBy: {
				id: this.createdBy.id,
				username: this.createdBy.username,
				avatarUrl: this.createdBy.avatarUrl ?? null,
			},
		};
	}
}
