import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseGuards,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogService } from './blog.service';
import { AnalyzeBlogUrlDto } from './dto/analyze-blog-url.dto';

@Controller('blog')
@UseInterceptors(ClassSerializerInterceptor)
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post('analyze')
	@UseGuards(AuthGuard('jwt'))
	async analyzeBlogWebsite(@Body(new ValidationPipe({ transform: true })) analyzeBlogUrlDto: AnalyzeBlogUrlDto) {
		const result = await this.blogService.analyzeUrl(analyzeBlogUrlDto.url);
		return result.toResponse();
	}
}
