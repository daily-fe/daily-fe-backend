import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';

@Injectable()
export class GetLikedArticlesUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
	) {}

	async execute(userId: number): Promise<ArticleResponse[]> {
		const likedByMeSubQuery = (qb) =>
			qb
				.select('COUNT(*) > 0', 'liked')
				.from('article_like', 'al')
				.where('al."articleId" = article.id')
				.andWhere('al."userId" = :userId', { userId });

		const qb = this.articleRepository
			.createQueryBuilder('article')
			.leftJoinAndSelect('article.likes', 'like')
			.leftJoinAndSelect('like.user', 'user')
			.leftJoinAndSelect('article.createdBy', 'createdBy')
			.where((qb) => {
				const subQuery = qb
					.subQuery()
					.select('1')
					.from('article_like', 'al')
					.where('al."articleId" = article.id')
					.andWhere('al."userId" = :userId')
					.getQuery();
				return `EXISTS ${subQuery}`;
			})
			.orderBy('article.createdAt', 'DESC')
			.addSelect('article.id', 'article_id')
			.addSelect(likedByMeSubQuery, 'likedByMe')
			.setParameter('userId', userId);

		const articles = await qb.getRawAndEntities();

		const likedByMeMap = new Map<string, boolean>();
		articles.raw.forEach((row: any) => {
			if (row.article_id !== undefined) {
				likedByMeMap.set(row.article_id, row.likedByMe === true || row.likedByMe === 'true');
			}
		});

		return articles.entities.map((article) => {
			const likedByMe = likedByMeMap.get(article.id) ?? false;
			return article.toResponse(likedByMe);
		});
	}
}
