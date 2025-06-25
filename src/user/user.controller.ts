import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
}
