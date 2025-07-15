import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursorPaginationResponseDto } from '../../utils/cursor-pagination.dto';
import { FeedResponseDto } from '../dto/feed-response.dto';
import { GetAllFeedsCursorInputDto } from '../dto/get-all-feeds-cursor-input.dto';
import { Feed } from '../entities/feed.entity';

@Injectable()
export class GetAllFeedsUseCase {
	constructor(
		@InjectRepository(Feed)
		private readonly feedRepository: Repository<Feed>,
	) {}

	async execute(input: GetAllFeedsCursorInputDto): Promise<CursorPaginationResponseDto<FeedResponseDto>> {
		const { cursor, limit, order = 'DESC' } = input;

		const qb = this.feedRepository.createQueryBuilder('feed');

		let parsedCursor: { publishedAt: string; id: string } | undefined;
		if (cursor) {
			try {
				const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8');
				parsedCursor = JSON.parse(jsonStr);
			} catch (e) {
				// invalid cursor, 무시
			}
		}

		if (parsedCursor) {
			const { publishedAt, id } = parsedCursor;
			if (order === 'DESC') {
				qb.andWhere(
					'(feed.publishedAt < :publishedAt OR (feed.publishedAt = :publishedAt AND feed.id < :id))',
					{ publishedAt, id },
				);
			} else {
				qb.andWhere(
					'(feed.publishedAt > :publishedAt OR (feed.publishedAt = :publishedAt AND feed.id > :id))',
					{ publishedAt, id },
				);
			}
		}

		qb.orderBy('feed.publishedAt', order as 'ASC' | 'DESC').addOrderBy('feed.id', order as 'ASC' | 'DESC');
		qb.take(limit);

		const feeds = await qb.getMany();
		const feedDtos = feeds.map((feed) => new FeedResponseDto(feed));

		const totalCount = await this.feedRepository.count();

		let nextCursor: string | undefined;
		if (feeds.length > 0) {
			const last = feeds[feeds.length - 1];
			if (last.publishedAt && last.id) {
				const cursorObj = { publishedAt: last.publishedAt.toISOString(), id: last.id };
				const jsonStr = JSON.stringify(cursorObj);
				nextCursor = Buffer.from(jsonStr).toString('base64');
			}
		}

		return new CursorPaginationResponseDto(feedDtos, totalCount, nextCursor);
	}
}
