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
			return BlogContentAnalysis.create(
				url,
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
}
