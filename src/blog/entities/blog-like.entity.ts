import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BlogContentAnalysis } from './blog-content-analysis.entity';

@Entity()
@Unique(['user', 'blog'])
export class BlogLike {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => User,
		(user) => user.blogLikes,
		{ eager: true },
	)
	user: User;

	@ManyToOne(
		() => BlogContentAnalysis,
		(blog) => blog.likes,
		{ eager: true },
	)
	@JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
	blog: BlogContentAnalysis;
}
