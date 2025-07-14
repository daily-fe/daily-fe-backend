import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedSource } from '../entities/feed-source.entity';

@Injectable()
export class FeedSourceService {
	constructor(
		@InjectRepository(FeedSource)
		private readonly feedSourceRepo: Repository<FeedSource>,
	) {}

	findAll() {
		return this.feedSourceRepo.find();
	}

	async create(dto: { site: string; url: string }) {
		const exists = await this.feedSourceRepo.findOne({ where: { site: dto.site, url: dto.url } });
		if (exists) {
			throw new BadRequestException('이미 사용중인 주소입니다.');
		}
		const entity = this.feedSourceRepo.create({ ...dto, isActive: true });
		return this.feedSourceRepo.save(entity);
	}

	async update(id: number, dto: Partial<FeedSource>) {
		if (dto.site && dto.url) {
			const exists = await this.feedSourceRepo.findOne({ where: { site: dto.site, url: dto.url } });
			if (exists && exists.id !== id) {
				throw new BadRequestException('이미 사용중인 주소입니다.');
			}
		}
		return this.feedSourceRepo.update(id, dto);
	}

	remove(id: number) {
		return this.feedSourceRepo.delete(id);
	}
}
