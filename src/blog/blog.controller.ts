import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AnalyzeBlogUrlDto } from './dto/analyze-blog-url.dto';

@Controller('blog')
@UseInterceptors(ClassSerializerInterceptor)
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post('analyze')
	async analyzeBlogWebsite(@Body(new ValidationPipe({ transform: true })) analyzeBlogUrlDto: AnalyzeBlogUrlDto) {
		const result = await this.blogService.analyzeUrl(analyzeBlogUrlDto.url);
		return result.toResponse();
	}
}
