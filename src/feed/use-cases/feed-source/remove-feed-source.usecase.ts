import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedSource } from '../../entities/feed-source.entity';

@Injectable()
export class RemoveFeedSourceUseCase {
	constructor(
		@InjectRepository(FeedSource)
		private readonly feedSourceRepo: Repository<FeedSource>,
	) {}

	async execute(id: number) {
		return this.feedSourceRepo.delete(id);
	}
}
