import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';
import { CursorPaginationResponseDto } from '../utils/cursor-pagination.dto';
import { FeedResponseDto } from './dto/feed-response.dto';
import { GetAllFeedsCursorInputDto } from './dto/get-all-feeds-cursor-input.dto';
import { GetAllFeedsUseCase } from './use-cases/get-all-feeds.usecase';

@Controller('feeds')
export class FeedController {
	constructor(private readonly getAllFeedsUseCase: GetAllFeedsUseCase) {}

	@Get()
	@Public()
	async getAllFeeds(
		@Query() query: GetAllFeedsCursorInputDto,
	): Promise<CursorPaginationResponseDto<FeedResponseDto>> {
		return this.getAllFeedsUseCase.execute(query);
	}
}
