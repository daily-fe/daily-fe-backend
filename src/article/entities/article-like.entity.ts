import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Article } from './article.entity';

@Entity()
@Unique(['user', 'article'])
export class ArticleLike {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => User,
		(user) => user.articleLikes,
		{ eager: true },
	)
	user: User;

	@ManyToOne(
		() => Article,
		(article) => article.likes,
		{ eager: true },
	)
	@JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
	article: Article;
}
