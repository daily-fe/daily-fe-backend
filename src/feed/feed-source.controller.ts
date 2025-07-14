import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateFeedSourceUseCase } from './use-cases/feed-source/create-feed-source.usecase';
import { FindAllFeedSourcesUseCase } from './use-cases/feed-source/find-all-feed-sources.usecase';
import { RemoveFeedSourceUseCase } from './use-cases/feed-source/remove-feed-source.usecase';
import { UpdateFeedSourceUseCase } from './use-cases/feed-source/update-feed-source.usecase';

@Public()
@Controller('feed-sources')
export class FeedSourceController {
	constructor(
		private readonly findAllFeedSourcesUseCase: FindAllFeedSourcesUseCase,
		private readonly createFeedSourceUseCase: CreateFeedSourceUseCase,
		private readonly updateFeedSourceUseCase: UpdateFeedSourceUseCase,
		private readonly removeFeedSourceUseCase: RemoveFeedSourceUseCase,
	) {}

	@Get()
	findAll() {
		return this.findAllFeedSourcesUseCase.execute();
	}

	@Post()
	create(@Body() dto: { site: string; url: string }) {
		return this.createFeedSourceUseCase.execute(dto);
	}

	@Patch(':id')
	update(@Param('id') id: number, @Body() dto: Partial<{ site: string; url: string; isActive: boolean }>) {
		return this.updateFeedSourceUseCase.execute(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.removeFeedSourceUseCase.execute(id);
	}
}
