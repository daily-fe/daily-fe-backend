import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeminiModel } from 'src/gemini/enums/gemini-model.enum';
import { GEMINI_SERVICE, IGeminiService } from 'src/gemini/interfaces/gemini.interface';
import { IWebContentScraper, WEB_CONTENT_SCRAPER } from 'src/scraper/interfaces/web-content-scraper.interface';
import { User } from 'src/user/entities/user.entity';
import { generateBase62Id } from 'src/utils/base62';
import { Repository } from 'typeorm';
import { BlogContentAnalysis } from './entities/blog-content-analysis.entity';
import { BlogLike } from './entities/blog-like.entity';

@Injectable()
export class BlogService {
	constructor(
		@Inject(WEB_CONTENT_SCRAPER)
		private readonly webContentScraper: IWebContentScraper,
		@Inject(GEMINI_SERVICE)
		private readonly geminiService: IGeminiService,
		@InjectRepository(BlogContentAnalysis)
		private readonly blogRepository: Repository<BlogContentAnalysis>,
		@InjectRepository(BlogLike)
		private readonly blogLikeRepository: Repository<BlogLike>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	private async generateUniqueId(): Promise<string> {
		let id: string;
		let exists = true;
		do {
			id = generateBase62Id();
			exists = await this.blogRepository.exist({ where: { id } });
		} while (exists);
		return id;
	}

	async analyzeUrl(url: string): Promise<BlogContentAnalysis> {
		const content = await this.webContentScraper.scrape(url);

		const prompt = `너는 주어진 텍스트에서 핵심 정보를 추출하여 JSON 형식으로 반환하는 전문 분석가이자 프론트엔드 개발자야.
다음 지침에 따라 주어진 텍스트를 분석하고 결과를 JSON으로 제공해줘.

[추출할 정보 및 지침]
1.  **title**: 글의 전체 제목 (필수)
2.  **summary**: 글의 핵심 내용을 한국어로 두 줄 요약해. 각 문장마다 \\n 으로 구분해줘.
3.  **tags**: 글의 주제를 나타내는 핵심 키워드 3~5개. (결과가 없다면 빈 배열 \`[]\`로)
4.  **author**: 글의 작성자. (결과가 없다면 빈 문자열 \`''\`로)
5.  **createdAt**: 글의 작성일. ('YYYY-MM-DD HH:MM' 형식, 결과가 없다면 빈 문자열 \`''\`로)
6.  **category**: 다음 중 가장 적절한 카테고리 하나를 선택: 'Deep Dive', 'Trends', 'Interview', 'Review', 'Others' (필수)

[출력 형식]
- 반드시 아래 JSON 스키마를 준수해야 하며, 다른 어떤 텍스트도 포함하지 마.
- \`tags\`는 문자열

\`\`\`json
{
  "title": "추출된 제목",
  "summary": "요약된 내용",
  "tags": ["태그1", "태그2", "태그3"],
  "author": "작성자 이름",
  "createdAt": "YYYY-MM-DD HH:MM",
  "category": "분류된 카테고리"
}
`;

		const fullPrompt = `${prompt}\n\n---\n[분석할 텍스트]:\n${content.substring(0, 10000)}`;

		const responseText = await this.geminiService.generateContent(fullPrompt, GeminiModel.FLASH);

		try {
			const analysis = JSON.parse(responseText);
			const id = await this.generateUniqueId();
			return new BlogContentAnalysis(
				url,
				id,
				analysis.title,
				analysis.summary,
				analysis.tags,
				analysis.author,
				analysis.createdAt,
				analysis.category,
			);
		} catch (error) {
			console.error('blogService analyzeUrl json parse error:', error);
			throw new BadRequestException('JSON 파싱 중 오류가 발생했습니다.');
		}
	}

	async createBlog(url: string): Promise<BlogContentAnalysis> {
		const exists = await this.blogRepository.findOne({ where: { url } });
		if (exists) throw new BadRequestException('이미 등록된 블로그입니다.');
		const blog = await this.analyzeUrl(url);
		return this.blogRepository.save(blog);
	}

	async likeBlog(id: string, userId: number) {
		const blog = await this.blogRepository.findOne({ where: { id } });
		if (!blog) throw new NotFoundException('Blog not found');

		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');

		const alreadyLiked = await this.blogLikeRepository.findOne({ where: { blog, user } });
		if (alreadyLiked) return;

		const like = this.blogLikeRepository.create({ blog, user });
		await this.blogLikeRepository.save(like);
	}

	async unlikeBlog(id: string, userId: number) {
		const blog = await this.blogRepository.findOne({ where: { id } });
		if (!blog) throw new NotFoundException('Blog not found');

		const like = await this.blogLikeRepository.findOne({
			where: {
				blog: { id: blog.id },
				user: { id: userId },
			},
		});
		if (like) {
			await this.blogLikeRepository.delete(like.id);
		}
	}

	async getBlogWithLikes(blogId: string, userId?: number) {
		if (!userId) {
			const blog = await this.blogRepository.findOne({
				where: { id: blogId },
				relations: ['likes', 'likes.user'],
			});
			if (!blog) throw new NotFoundException('Blog not found');
			return blog.toResponse(false);
		}

		// QueryBuilder로 likedByMe를 효율적으로 조회
		const blog = await this.blogRepository
			.createQueryBuilder('blog')
			.leftJoinAndSelect('blog.likes', 'like')
			.leftJoinAndSelect('like.user', 'user')
			.where('blog.id = :blogId', { blogId })
			.addSelect(
				(qb) =>
					qb
						.select('COUNT(*) > 0', 'liked')
						.from('blog_like', 'bl')
						.where('bl."blogId" = :blogId', { blogId })
						.andWhere('bl."userId" = :userId', { userId }),
				'likedByMe',
			)
			.getRawAndEntities();

		const entity = blog.entities[0];
		if (!entity) throw new NotFoundException('Blog not found');
		const likedByMe = blog.raw[0]?.likedByMe === true || blog.raw[0]?.likedByMe === 'true';
		return entity.toResponse(likedByMe);
	}

	async getAllBlogs(userId?: number) {
		if (!userId) {
			const blogs = await this.blogRepository.find({
				relations: ['likes', 'likes.user'],
				order: { createdAt: 'DESC' },
			});
			return blogs.map((blog) => blog.toResponse(false));
		}

		// userId가 실제로 존재하는지 체크
		const userExists = await this.userRepository.exist({ where: { id: userId } });
		if (!userExists) {
			const blogs = await this.blogRepository.find({
				relations: ['likes', 'likes.user'],
				order: { createdAt: 'DESC' },
			});
			return blogs.map((blog) => blog.toResponse(false));
		}

		const blogs = await this.blogRepository
			.createQueryBuilder('blog')
			.leftJoinAndSelect('blog.likes', 'like')
			.leftJoinAndSelect('like.user', 'user')
			.orderBy('blog.createdAt', 'DESC')
			.addSelect('blog.id', 'blog_id')
			.addSelect((qb) => {
				return qb
					.select('COUNT(*) > 0', 'liked')
					.from('blog_like', 'bl')
					.where('bl."blogId" = blog.id')
					.andWhere('bl."userId" = :userId', { userId });
			}, 'likedByMe')
			.getRawAndEntities();

		const likedByMeMap = new Map<string, boolean>();
		blogs.raw.forEach((row: any) => {
			if (row.blog_id !== undefined) {
				likedByMeMap.set(row.blog_id, row.likedByMe === true || row.likedByMe === 'true');
			}
		});

		return blogs.entities.map((blog) => {
			const likedByMe = likedByMeMap.get(blog.id) ?? false;
			return blog.toResponse(likedByMe);
		});
	}
}
