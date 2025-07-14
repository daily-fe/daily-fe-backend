import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedSource } from '../../entities/feed-source.entity';

@Injectable()
export class FindAllFeedSourcesUseCase {
	constructor(
		@InjectRepository(FeedSource)
		private readonly feedSourceRepo: Repository<FeedSource>,
	) {}

	async execute() {
		return this.feedSourceRepo.find();
	}
}
