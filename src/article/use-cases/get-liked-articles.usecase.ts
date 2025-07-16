import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { decodeGenericCursor, encodeGenericCursor } from '../../utils/cursor.util';
import { CursorPaginationResponseDto } from '../../utils/cursor-pagination.dto';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';

@Injectable()
export class GetLikedArticlesUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
	) {}

	private buildBaseQuery(userId: number): SelectQueryBuilder<Article> {
		const qb = this.articleRepository
			.createQueryBuilder('article')
			.leftJoinAndSelect('article.likes', 'like')
			.leftJoinAndSelect('like.user', 'user')
			.leftJoinAndSelect('article.createdBy', 'createdBy')
			.orderBy('article.createdAt', 'DESC')
			.addOrderBy('article.id', 'DESC')
			.setParameter('userId', userId);

		// 좋아요 한 아티클만 필터링
		const subQuery = qb
			.subQuery()
			.select('1')
			.from('article_like', 'al')
			.where('al."articleId" = article.id')
			.andWhere('al."userId" = :userId')
			.getQuery();

		qb.where(`EXISTS ${subQuery}`);
		return qb;
	}

	private static getNextCursor<T extends { createdAt: Date | null; id: string }>(entities: T[]): string | undefined {
		if (entities.length === 0) return undefined;
		const last = entities[entities.length - 1];
		if (last.createdAt && last.id) {
			return encodeGenericCursor(last, ['createdAt', 'id']);
		}
		return undefined;
	}

	private static mapLikedByMe(raw: any[]): Map<string, boolean> {
		const likedByMeMap = new Map<string, boolean>();

		raw.forEach((row) => {
			// article.id는 자동으로 포함됨 → 정확한 키 확인 필요
			const id = row['article_id'] || row['article.id'] || row.article_id_1;
			if (id) {
				likedByMeMap.set(id, row.likedByMe === true || row.likedByMe === 'true');
			}
		});

		return likedByMeMap;
	}

	async execute(
		userId: number,
		cursor?: string,
		limit: number = 10,
	): Promise<CursorPaginationResponseDto<ArticleResponse>> {
		// 2. 페이지네이션용 쿼리
		const qb = this.buildBaseQuery(userId);

		const parsedCursor = decodeGenericCursor<{ createdAt: string; id: string }>(cursor);
		if (parsedCursor) {
			const { createdAt, id } = parsedCursor;
			qb.andWhere('(article.createdAt < :createdAt OR (article.createdAt = :createdAt AND article.id < :id))', {
				createdAt: new Date(createdAt),
				id,
			});
		}
		qb.take(limit + 1); // hasNext 판별을 위해 +1

		// likedByMe: 현재 사용자가 좋아요했는지 여부도 명시적으로 select
		const likedByMeSubQuery = (subQb: SelectQueryBuilder<Article>) =>
			subQb
				.select('COUNT(*) > 0')
				.from('article_like', 'al')
				.where('al."articleId" = article.id')
				.andWhere('al."userId" = :userId', { userId });

		const { entities, raw } = await qb.addSelect(likedByMeSubQuery, 'likedByMe').getRawAndEntities();

		const pagedEntities = entities.slice(0, limit);
		const likedByMeMap = GetLikedArticlesUseCase.mapLikedByMe(raw.slice(0, limit));
		const responses = pagedEntities.map((article) => article.toResponse(likedByMeMap.get(article.id) ?? false));

		const nextCursor = entities.length > limit ? GetLikedArticlesUseCase.getNextCursor(pagedEntities) : undefined;

		return new CursorPaginationResponseDto(responses, nextCursor);
	}
}
