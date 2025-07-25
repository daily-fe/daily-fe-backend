import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decodeGenericCursor, encodeGenericCursor } from '../../utils/cursor.util';
import { CursorPaginationResponseDto } from '../../utils/cursor-pagination.dto';
import { ArticleGetAllInputDto } from '../dto/article-get-all-input.dto';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';

interface ArticleRaw {
	article_id: string;
	likedByMe?: boolean | string;
}

@Injectable()
export class GetAllArticlesUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
	) {}

	private buildBaseQuery(input: ArticleGetAllInputDto) {
		const { series, category, keyword } = input;
		const qb = this.articleRepository
			.createQueryBuilder('article')
			.leftJoinAndSelect('article.likes', 'like')
			.leftJoinAndSelect('article.createdBy', 'createdBy')
			.orderBy('article.createdAt', 'DESC')
			.addOrderBy('article.id', 'DESC');

		if (series) {
			qb.andWhere('article.series = :series', { series });
		}
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

	private getNextCursor<T extends { createdAt: Date | null; id: string }>(entities: T[]) {
		if (entities.length === 0) return undefined;
		const last = entities[entities.length - 1];
		if (last.createdAt && last.id) {
			return encodeGenericCursor(last, ['createdAt', 'id']);
		}
		return undefined;
	}

	private mapLikedByMe(raw: ArticleRaw[]): Map<string, boolean> {
		const likedByMeMap = new Map<string, boolean>();
		raw.forEach((row) => {
			if (row.article_id !== undefined) {
				likedByMeMap.set(row.article_id, row.likedByMe === true || row.likedByMe === 'true');
			}
		});
		return likedByMeMap;
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

		let articleResponses: ArticleResponse[];
		let entities: Article[];
		let nextCursor: string | undefined;

		if (userId) {
			const articles = await qb
				.addSelect((subQuery) => {
					return subQuery
						.select('COUNT(*) > 0')
						.from('article_like', 'al')
						.where('al."articleId" = article.id')
						.andWhere('al."userId" = :userId', { userId });
				}, 'likedByMe')
				.getRawAndEntities();

			const hasNext = articles.entities.length > limit;
			const pagedEntities = articles.entities.slice(0, limit);
			const pagedRaw = (articles.raw as ArticleRaw[]).slice(0, limit);
			const likedByMeMap = this.mapLikedByMe(pagedRaw);
			articleResponses = pagedEntities.map((article) => {
				const likedByMe = likedByMeMap.get(article.id) ?? false;
				return article.toResponse(likedByMe);
			});
			entities = pagedEntities;
			nextCursor = hasNext ? this.getNextCursor(entities) : undefined;
		} else {
			const results = await qb.getMany();
			const hasNext = results.length > limit;
			entities = results.slice(0, limit);
			articleResponses = entities.map((article) => article.toResponse(false));
			nextCursor = hasNext ? this.getNextCursor(entities) : undefined;
		}

		return new CursorPaginationResponseDto(articleResponses, nextCursor);
	}
}
