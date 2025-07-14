import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserUseCase {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async execute(userData: Partial<User>): Promise<User> {
		const user = this.userRepository.create(userData);
		return this.userRepository.save(user);
	}
}
