import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';

@Injectable()
export class GetArticleUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
	) {}

	async execute(articleId: string, userId?: number): Promise<ArticleResponse> {
		if (!userId) {
			const article = await this.articleRepository.findOne({
				where: { id: articleId },
				relations: ['likes', 'likes.user', 'createdBy'],
			});
			if (!article) throw new NotFoundException('Article not found');
			return article.toResponse(false);
		}
		const article = await this.articleRepository
			.createQueryBuilder('article')
			.leftJoinAndSelect('article.likes', 'like')
			.leftJoinAndSelect('like.user', 'user')
			.leftJoinAndSelect('article.createdBy', 'createdBy')
			.where('article.id = :articleId', { articleId })
			.addSelect(
				(qb) =>
					qb
						.select('COUNT(*) > 0', 'liked')
						.from('article_like', 'al')
						.where('al."articleId" = :articleId', { articleId })
						.andWhere('al."userId" = :userId', { userId }),
				'likedByMe',
			)
			.getRawAndEntities();
		const entity = article.entities[0];
		if (!entity) throw new NotFoundException('Article not found');
		const likedByMe = article.raw[0]?.likedByMe === true || article.raw[0]?.likedByMe === 'true';
		return entity.toResponse(likedByMe);
	}
}
