import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ArticleResponse } from '../dto/article-response.dto';
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

	async execute(id: string, userId: number): Promise<ArticleResponse> {
		const article = await this.articleRepository.findOne({
			where: { id },
			relations: ['likes', 'likes.user', 'createdBy'],
		});
		if (!article) throw new NotFoundException('Article not found');
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');
		const alreadyLiked = await this.articleLikeRepository.findOne({ where: { article, user } });
		if (!alreadyLiked) {
			const like = this.articleLikeRepository.create({ article, user });
			await this.articleLikeRepository.save(like);
		}
		// 좋아요 반영된 최신 Article 조회
		const updatedArticle = await this.articleRepository.findOne({
			where: { id },
			relations: ['likes', 'likes.user', 'createdBy'],
		});
		if (!updatedArticle) throw new NotFoundException('Article not found');
		return updatedArticle.toResponse(true);
	}
}
