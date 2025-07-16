import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';

@Injectable()
export class DeleteArticleUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
	) {}

	async execute(id: string, userId: number): Promise<void> {
		const article = await this.articleRepository.findOne({ where: { id } });
		if (!article) {
			throw new NotFoundException('아티클을 찾을 수 없습니다.');
		}
		if (article.createdBy.id !== userId) {
			throw new NotFoundException('본인이 작성한 글만 삭제할 수 있습니다.');
		}
		await this.articleRepository.delete(id);
	}
}
