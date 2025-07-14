import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class FindUserByGithubIdUseCase {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async execute(githubId: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { githubId } });
		return user ?? undefined;
	}
}
