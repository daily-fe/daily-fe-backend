import { IsNotEmpty, IsUrl } from 'class-validator';

export class AnalyzeArticleUrlDto {
	@IsNotEmpty({ message: 'URL을 입력해주세요.' })
	@IsUrl({}, { message: '유효한 URL을 입력해주세요.' })
	url: string;
}
