import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
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
		{ eager: true, onDelete: 'CASCADE' },
	)
	@JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
	article: Article;
}
