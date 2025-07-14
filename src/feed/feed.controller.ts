import { Controller, Get } from '@nestjs/common';
import { FeedResponseDto } from './dto/feed-response.dto';
import { Feed } from './entities/feed.entity';
import { GetAllFeedsUseCase } from './use-cases/get-all-feeds.usecase';

@Controller('feeds')
export class FeedController {
	constructor(private readonly getAllFeedsUseCase: GetAllFeedsUseCase) {}

	@Get()
	async getAllFeeds(): Promise<FeedResponseDto[]> {
		const feeds: Feed[] = await this.getAllFeedsUseCase.execute();
		return feeds.map((feed) => new FeedResponseDto(feed));
	}
}
