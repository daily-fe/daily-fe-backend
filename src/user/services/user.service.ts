import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async findByGithubId(githubId: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { githubId } });
		return user ?? undefined;
	}

	async create(userData: Partial<User>): Promise<User> {
		const user = this.userRepository.create(userData);
		return this.userRepository.save(user);
	}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async update(user: Partial<User>): Promise<User> {
		return this.userRepository.save(user);
	}
}
