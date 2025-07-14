import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeminiModel } from 'src/gemini/enums/gemini-model.enum';
import { GEMINI_SERVICE, IGeminiService } from 'src/gemini/interfaces/gemini.interface';
import { IWebContentScraper, WEB_CONTENT_SCRAPER } from 'src/scraper/interfaces/web-content-scraper.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';

@Injectable()
export class AnalyzeArticleUrlUseCase {
	constructor(
		@Inject(WEB_CONTENT_SCRAPER)
		private readonly webContentScraper: IWebContentScraper,
		@Inject(GEMINI_SERVICE)
		private readonly geminiService: IGeminiService,
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
	) {}

	private async generateUniqueId(): Promise<string> {
		let id: string;
		let exists = true;
		do {
			id = Article.create('', '', '', [], '', new Date(), 'Others', {} as User).id;
			exists = await this.articleRepository.exists({ where: { id } });
		} while (exists);
		return id;
	}

	async execute(url: string, createdBy: User): Promise<Article> {
		const content = await this.webContentScraper.scrapePageContent(url);
		const prompt = `너는 주어진 텍스트에서 핵심 정보를 추출하여 JSON 형식으로 반환하는 전문 분석가이자 프론트엔드 개발자야.\n다음 지침에 따라 주어진 텍스트를 분석하고 결과를 JSON으로 제공해줘.\n\n[추출할 정보 및 지침]\n1.  **title**: 글의 전체 제목 (필수)\n2.  **summary**: 글의 핵심 내용을 한국어로 두 줄 요약해. 각 문장마다 \\n 으로 구분해줘.\n3.  **tags**: 글의 주제를 나타내는 핵심 키워드 3~5개. (결과가 없다면 빈 배열 \`[]\`로)\n4.  **author**: 글의 작성자. (결과가 없다면 빈 문자열 \`''\`로)\n5.  **createdAt**: 글의 작성일. ('YYYY-MM-DD HH:MM' 형식, 결과가 없다면 빈 문자열 \`''\`로)\n6.  **category**: 다음 중 가장 적절한 카테고리 하나를 선택: 'Deep Dive', 'Trends', 'Interview', 'Review', 'Others' (필수)\n\n[출력 형식]\n- 반드시 아래 JSON 스키마를 준수해야 하며, 다른 어떤 텍스트도 포함하지 마.\n- \`tags\`는 문자열\n\n\`\`\`json\n{\n  "title": "추출된 제목",\n  "summary": "요약된 내용",\n  "tags": ["태그1", "태그2", "태그3"],\n  "author": "작성자 이름",\n  "createdAt": "YYYY-MM-DD HH:MM",\n  "category": "분류된 카테고리"\n}\n\n`;
		const fullPrompt = `${prompt}\n\n---\n[분석할 텍스트]:\n${content.substring(0, 10000)}`;
		const responseText = await this.geminiService.generateContent(fullPrompt, GeminiModel.FLASH);
		try {
			const analysis = JSON.parse(responseText);
			const id = await this.generateUniqueId();
			return new Article(
				url,
				id,
				analysis.title,
				analysis.summary,
				analysis.tags,
				analysis.author,
				analysis.createdAt,
				analysis.category,
				createdBy,
			);
		} catch (error) {
			console.error('AnalyzeArticleUrlUseCase json parse error:', error);
			throw new BadRequestException('JSON 파싱 중 오류가 발생했습니다.');
		}
	}
}
