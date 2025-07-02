import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { BlogService } from './blog.service';
import { AnalyzeBlogUrlDto } from './dto/analyze-blog-url.dto';

@Controller('blog')
@UseInterceptors(ClassSerializerInterceptor)
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post('analyze')
	async analyzeBlogWebsite(@Body(new ValidationPipe({ transform: true })) analyzeBlogUrlDto: AnalyzeBlogUrlDto) {
		const result = await this.blogService.analyzeUrl(analyzeBlogUrlDto.url);
		return result.toResponse(false);
	}

	@Post(':id/like')
	async likeBlog(@Param('id') id: string, @Req() req) {
		await this.blogService.likeBlog(id, req.user.userId);
		return { success: true };
	}

	@Delete(':id/like')
	async unlikeBlog(@Param('id') id: string, @Req() req) {
		await this.blogService.unlikeBlog(id, req.user.id);
		return { success: true };
	}

	@Get(':id')
	async getBlog(@Param('id') id: string, @Req() req) {
		const userId = req.user?.id;
		return this.blogService.getBlogWithLikes(id, userId);
	}

	@Get()
	@Public()
	@UseGuards(OptionalAuthGuard)
	async getAllBlogs(@Req() req) {
		console.log('req', req.user);
		const userId = req.user?.id;
		return this.blogService.getAllBlogs(userId);
	}

	@Post()
	async createBlog(@Body(new ValidationPipe({ transform: true })) analyzeBlogUrlDto: AnalyzeBlogUrlDto) {
		const result = await this.blogService.createBlog(analyzeBlogUrlDto.url);
		return result.toResponse(false);
	}
}
