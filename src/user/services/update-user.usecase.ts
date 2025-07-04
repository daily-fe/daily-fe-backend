import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserUpdateInputDto } from '../dto/user-update-input.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async execute(userId: number, input: UserUpdateInputDto): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');
		if (input.nickname !== undefined) user.nickname = input.nickname;
		if (input.profileImageUrl !== undefined) user.avatarUrl = input.profileImageUrl;
		return this.userRepository.save(user);
	}
}
