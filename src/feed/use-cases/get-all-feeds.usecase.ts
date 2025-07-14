import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '../entities/feed.entity';

@Injectable()
export class GetAllFeedsUseCase {
	constructor(
		@InjectRepository(Feed)
		private readonly feedRepository: Repository<Feed>,
	) {}

	async execute(): Promise<Feed[]> {
		return this.feedRepository.find({ order: { publishedAt: 'DESC' } });
	}
}
