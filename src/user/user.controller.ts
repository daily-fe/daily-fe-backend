import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
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
	async findAll(): Promise<UserResponseDto[]> {
		const users = await this.findAllUsersUseCase.execute();
		return users.map((user) => new UserResponseDto(user));
	}

	@Post()
	async create(@Body() userData: Partial<User>): Promise<UserResponseDto> {
		const user = await this.createUserUseCase.execute(userData);
		return new UserResponseDto(user);
	}

	@Get(':githubId')
	async findByGithubId(@Param('githubId') githubId: string): Promise<UserResponseDto | undefined> {
		const user = await this.findUserByGithubIdUseCase.execute(githubId);
		return user ? new UserResponseDto(user) : undefined;
	}

	@Post('update')
	async update(@Body() userData: Partial<User>, @Req() req): Promise<UserResponseDto> {
		const userId = req.user.id;
		const user = await this.updateUserUseCase.execute(userId, userData);
		return new UserResponseDto(user);
	}

	@Patch('me')
	async updateMe(@Req() req, @Body() input: UserUpdateInputDto): Promise<UserResponseDto> {
		const userId = req.user.id;
		const user = await this.updateUserUseCase.execute(userId, input);
		return new UserResponseDto(user);
	}
}
