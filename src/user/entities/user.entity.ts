import { ArticleLike } from 'src/article/entities/article-like.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum Role {
	admin,
	user,
}

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	githubId: string;

	@Column()
	username: string;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	avatarUrl: string;

	@Column({ nullable: true })
	nickname: string;

	@Column({
		enum: Role,
		default: Role.user,
	})
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(
		() => ArticleLike,
		(like) => like.user,
	)
	articleLikes: ArticleLike[];
}
