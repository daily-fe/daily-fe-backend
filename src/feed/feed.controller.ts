import { Controller, Get } from '@nestjs/common';
import { GetAllFeedsUseCase } from './use-cases/get-all-feeds.usecase';

@Controller('feeds')
export class FeedController {
	constructor(private readonly getAllFeedsUseCase: GetAllFeedsUseCase) {}

	@Get()
	async getAllFeeds() {
		return this.getAllFeedsUseCase.execute();
	}
}
