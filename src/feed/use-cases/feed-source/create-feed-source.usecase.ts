import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedSource } from '../../entities/feed-source.entity';

@Injectable()
export class CreateFeedSourceUseCase {
	constructor(
		@InjectRepository(FeedSource)
		private readonly feedSourceRepo: Repository<FeedSource>,
	) {}

	async execute(dto: { site: string; url: string }) {
		const exists = await this.feedSourceRepo.findOne({ where: { site: dto.site, url: dto.url } });
		if (exists) {
			throw new BadRequestException('이미 사용중인 주소입니다.');
		}
		const entity = this.feedSourceRepo.create({ ...dto, isActive: true });
		return this.feedSourceRepo.save(entity);
	}
}
