import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { decodeGenericCursor, encodeGenericCursor } from '../../utils/cursor.util';
import { CursorPaginationResponseDto } from '../../utils/cursor-pagination.dto';
import { ArticleGetAllInputDto } from '../dto/article-get-all-input.dto';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';

@Injectable()
export class GetAllArticlesUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
	) {}

	private buildBaseQuery(input: ArticleGetAllInputDto): SelectQueryBuilder<Article> {
		const { category, keyword } = input;
		const qb = this.articleRepository
			.createQueryBuilder('article')
			.leftJoinAndSelect('article.likes', 'like')
			.leftJoinAndSelect('article.createdBy', 'createdBy')
			.orderBy('article.createdAt', 'DESC')
			.addOrderBy('article.id', 'DESC');

		if (category) {
			qb.andWhere('article.category = :category', { category });
		}
		if (keyword) {
			qb.andWhere('(article.title ILIKE :keyword OR article.summary ILIKE :keyword)', {
				keyword: `%${keyword}%`,
			});
		}
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

	private static mapLikedByMe(raw: { article_id: string; likedByMe?: boolean | string }[]): Map<string, boolean> {
		return new Map(
			raw
				.filter((row) => row.article_id !== undefined)
				.map((row) => [row.article_id, row.likedByMe === true || row.likedByMe === 'true']),
		);
	}

	async execute(
		input: ArticleGetAllInputDto,
		userId?: number,
	): Promise<CursorPaginationResponseDto<ArticleResponse>> {
		const { cursor, limit = 10 } = input;
		const qb = this.buildBaseQuery(input);

		const parsedCursor = decodeGenericCursor<{ createdAt: string; id: string }>(cursor);
		if (parsedCursor) {
			const { createdAt, id } = parsedCursor;
			qb.andWhere('(article.createdAt < :createdAt OR (article.createdAt = :createdAt AND article.id < :id))', {
				createdAt: new Date(createdAt),
				id,
			});
		}
		qb.take(limit + 1);

		if (userId) {
			const { entities, raw } = await qb
				.addSelect(
					(subQuery) =>
						subQuery
							.select('COUNT(*) > 0')
							.from('article_like', 'al')
							.where('al."articleId" = article.id')
							.andWhere('al."userId" = :userId', { userId }),
					'likedByMe',
				)
				.getRawAndEntities();

			const pagedEntities = entities.slice(0, limit);
			const likedByMeMap = GetAllArticlesUseCase.mapLikedByMe(raw.slice(0, limit));
			const responses = pagedEntities.map((article) => article.toResponse(likedByMeMap.get(article.id) ?? false));
			const nextCursor = entities.length > limit ? GetAllArticlesUseCase.getNextCursor(pagedEntities) : undefined;
			return new CursorPaginationResponseDto(responses, nextCursor);
		} else {
			const entities = await qb.getMany();
			const pagedEntities = entities.slice(0, limit);
			const responses = pagedEntities.map((article) => article.toResponse(false));
			const nextCursor = entities.length > limit ? GetAllArticlesUseCase.getNextCursor(pagedEntities) : undefined;
			return new CursorPaginationResponseDto(responses, nextCursor);
		}
	}
}
