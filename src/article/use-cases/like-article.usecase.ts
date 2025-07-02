import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { ArticleLike } from '../entities/article-like.entity';

@Injectable()
export class LikeArticleUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
		@InjectRepository(ArticleLike)
		private readonly articleLikeRepository: Repository<ArticleLike>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async execute(id: string, userId: number): Promise<void> {
		const article = await this.articleRepository.findOne({ where: { id } });
		if (!article) throw new NotFoundException('Article not found');
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');
		const alreadyLiked = await this.articleLikeRepository.findOne({ where: { article, user } });
		if (alreadyLiked) return;
		const like = this.articleLikeRepository.create({ article, user });
		await this.articleLikeRepository.save(like);
	}
}
