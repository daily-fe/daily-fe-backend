import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserUpdateInputDto } from './dto/user-update-input.dto';
import { User } from './entities/user.entity';
import { CreateUserUseCase } from './services/create-user.usecase';
import { FindAllUsersUseCase } from './services/find-all-users.usecase';
import { FindUserByGithubIdUseCase } from './services/find-user-by-github-id.usecase';
import { UpdateUserUseCase } from './services/update-user.usecase';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
	constructor(
		private readonly findAllUsersUseCase: FindAllUsersUseCase,
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly findUserByGithubIdUseCase: FindUserByGithubIdUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
	) {}

	@Get()
	async findAll(): Promise<User[]> {
		return this.findAllUsersUseCase.execute();
	}

	@Post()
	async create(@Body() userData: Partial<User>): Promise<User> {
		return this.createUserUseCase.execute(userData);
	}

	@Get(':githubId')
	async findByGithubId(@Param('githubId') githubId: string): Promise<User | undefined> {
		return this.findUserByGithubIdUseCase.execute(githubId);
	}

	@Post('update')
	async update(@Body() userData: Partial<User>, @Req() req): Promise<User> {
		const userId = req.user.id;
		return this.updateUserUseCase.execute(userId, userData);
	}

	@Patch('me')
	async updateMe(@Req() req, @Body() input: UserUpdateInputDto) {
		const userId = req.user.id;
		return this.updateUserUseCase.execute(userId, input);
	}
}
