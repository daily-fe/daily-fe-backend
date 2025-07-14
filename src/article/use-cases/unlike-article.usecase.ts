import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';
import { ArticleLike } from '../entities/article-like.entity';

@Injectable()
export class UnlikeArticleUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
		@InjectRepository(ArticleLike)
		private readonly articleLikeRepository: Repository<ArticleLike>,
	) {}

	async execute(id: string, userId: number): Promise<ArticleResponse> {
		const article = await this.articleRepository.findOne({
			where: { id },
			relations: ['likes', 'likes.user', 'createdBy'],
		});
		if (!article) throw new NotFoundException('Article not found');
		const like = await this.articleLikeRepository.findOne({
			where: {
				article: { id: article.id },
				user: { id: userId },
			},
		});
		if (like) {
			await this.articleLikeRepository.delete(like.id);
		}
		// 좋아요 반영된 최신 Article 조회
		const updatedArticle = await this.articleRepository.findOne({
			where: { id },
			relations: ['likes', 'likes.user', 'createdBy'],
		});
		if (!updatedArticle) throw new NotFoundException('Article not found');
		return updatedArticle.toResponse(false);
	}
}
