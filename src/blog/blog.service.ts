import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GeminiModel } from 'src/gemini/enums/gemini-model.enum';
import { GEMINI_SERVICE, IGeminiService } from 'src/gemini/interfaces/gemini.interface';
import { IWebContentScraper, WEB_CONTENT_SCRAPER } from 'src/scraper/interfaces/web-content-scraper.interface';
import { BlogContentAnalysis } from './entities/blog-content-analysis.entity';

@Injectable()
export class BlogService {
	constructor(
		@Inject(WEB_CONTENT_SCRAPER)
		private readonly webContentScraper: IWebContentScraper,
		@Inject(GEMINI_SERVICE)
		private readonly geminiService: IGeminiService,
	) {}

	async analyzeUrl(url: string): Promise<BlogContentAnalysis> {
		const content = await this.webContentScraper.scrape(url);

		const promptTemplate = `
			다음 텍스트를 분석해서 제목, 150자 내외의 한국어 요약, 그리고 이 글의 핵심 내용을 나타내는 쉼표로 구분된 태그 3~5개, 작성자, 작성일을 추출해줘.
			title, summary는 필수값이고 다른 필드 값들이 없다면 tags는 빈 배열, 나머지는 undefined 처리해줘.
			반드시 다음과 같은 JSON 형식으로만 응답해야 해:
			{"title": "추출된 제목", "summary": "요약 내용", "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"], 'author': '추출된 작성자', 'createdAt': 'YYYY-MM-DD HH:MM'}
		`;

		const fullPrompt = `${promptTemplate}\n\n---\n분석할 텍스트:\n${content.substring(0, 10000)}`;

		const responseText = await this.geminiService.generateContent(fullPrompt, GeminiModel.FLASH);

		try {
			const analysis = JSON.parse(responseText);
			return BlogContentAnalysis.create(
				analysis.title,
				analysis.summary,
				analysis.tags,
				analysis.author,
				analysis.createdAt,
			);
		} catch (error) {
			console.error('blogService analyzeUrl json parse error:', error);
			throw new BadRequestException('JSON 파싱 중 오류가 발생했습니다.');
		}
	}
}
