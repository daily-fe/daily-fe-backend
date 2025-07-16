import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ArticleCreateInput } from '../dto/article-create-input.dto';
import { ArticleResponse } from '../dto/article-response.dto';
import { Article } from '../entities/article.entity';
import { ArticleLike } from '../entities/article-like.entity';

@Injectable()
export class CreateArticleUseCase {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
		@InjectRepository(ArticleLike)
		private readonly articleLikeRepository: Repository<ArticleLike>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async execute(dto: ArticleCreateInput, userId?: number): Promise<ArticleResponse> {
		const { url, title, summary, tags, author, series } = dto;
		const exists = await this.articleRepository.findOne({ where: { url } });
		if (exists) throw new BadRequestException('이미 등록된 아티클입니다.');
		let user: User | undefined;
		if (userId) {
			const found = await this.userRepository.findOne({ where: { id: userId } });
			user = found ?? undefined;
		}
		if (!user) throw new BadRequestException('유효하지 않은 사용자입니다.');
		const article = new Article(
			url,
			Article.create(url, title, summary, tags, author, new Date(), series, user).id,
			title,
			summary,
			tags,
			author,
			new Date(),
			series,
			user,
		);
		const savedArticle = await this.articleRepository.save(article);
		if (user) {
			const like = this.articleLikeRepository.create({ article: savedArticle, user });
			await this.articleLikeRepository.save(like);
		}
		const articleWithLikes = await this.articleRepository.findOne({
			where: { id: savedArticle.id },
			relations: ['likes', 'likes.user', 'createdBy'],
		});
		if (!articleWithLikes) throw new BadRequestException('Article not found');
		return articleWithLikes.toResponse(true);
	}
}
