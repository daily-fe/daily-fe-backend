import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserUpdateInputDto } from './dto/user-update-input.dto';
import { User } from './entities/user.entity';
import { UpdateUserUseCase } from './services/update-user.usecase';
import { UserService } from './services/user.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly updateUserUseCase: UpdateUserUseCase,
	) {}

	@Get()
	async findAll(): Promise<User[]> {
		return this.userService.findAll();
	}

	@Post()
	async create(@Body() userData: Partial<User>): Promise<User> {
		return this.userService.create(userData);
	}

	@Get(':githubId')
	async findByGithubId(@Param('githubId') githubId: string): Promise<User | undefined> {
		return this.userService.findByGithubId(githubId);
	}

	@Post('update')
	async update(@Body() userData: Partial<User>, @Req() req): Promise<User> {
		const userId = req.user.id;
		return this.userService.update({ ...userData, id: userId });
	}

	@Patch('me')
	async updateMe(@Req() req, @Body() input: UserUpdateInputDto) {
		const userId = req.user.id;
		return this.updateUserUseCase.execute(userId, input);
	}
}
