import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

	async execute(id: string, userId: number): Promise<void> {
		const article = await this.articleRepository.findOne({ where: { id } });
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
	}
}
