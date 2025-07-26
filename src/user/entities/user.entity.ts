import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ArticleLike } from '../../article/entities/article-like.entity';

export enum Role {
	ADMIN = 'admin',
	USER = 'user',
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
		default: Role.USER,
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
