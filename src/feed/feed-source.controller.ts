import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { FeedSourceService } from './services/feed-source.service';

@Public()
@Controller('feed-sources')
export class FeedSourceController {
	constructor(private readonly feedSourceService: FeedSourceService) {}

	@Get()
	findAll() {
		return this.feedSourceService.findAll();
	}

	@Post()
	create(@Body() dto: { site: string; url: string }) {
		return this.feedSourceService.create(dto);
	}

	@Patch(':id')
	update(@Param('id') id: number, @Body() dto: Partial<{ site: string; url: string; isActive: boolean }>) {
		return this.feedSourceService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.feedSourceService.remove(id);
	}
}
