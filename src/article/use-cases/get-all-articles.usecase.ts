import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';

@Injectable()
export class GetAllArticlesUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async execute(userId?: number): Promise<ArticleResponse[]> {
		if (!userId) {
			const articles = await this.articleRepository.find({
				relations: ['likes', 'likes.user', 'createdBy'],
				order: { createdAt: 'DESC' },
			});
			return articles.map((article) => article.toResponse(false));
		}
		const userExists = await this.userRepository.exists({ where: { id: userId } });
		if (!userExists) {
			const articles = await this.articleRepository.find({
				relations: ['likes', 'likes.user', 'createdBy'],
				order: { createdAt: 'DESC' },
			});
			return articles.map((article) => article.toResponse(false));
		}
		const articles = await this.articleRepository
			.createQueryBuilder('article')
			.leftJoinAndSelect('article.likes', 'like')
			.leftJoinAndSelect('like.user', 'user')
			.leftJoinAndSelect('article.createdBy', 'createdBy')
			.orderBy('article.createdAt', 'DESC')
			.addSelect('article.id', 'article_id')
			.addSelect((qb) => {
				return qb
					.select('COUNT(*) > 0', 'liked')
					.from('article_like', 'al')
					.where('al."articleId" = article.id')
					.andWhere('al."userId" = :userId', { userId });
			}, 'likedByMe')
			.getRawAndEntities();
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
