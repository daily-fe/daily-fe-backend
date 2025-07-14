import { Role } from '../entities/user.entity';

export class UserResponseDto {
	id: number;
	githubId: string;
	username: string;
	email?: string;
	avatarUrl?: string;
	nickname?: string;
	role: Role;
	createdAt: Date;
	updatedAt: Date;

	constructor(user: any) {
		this.id = user.id;
		this.githubId = user.githubId;
		this.username = user.username;
		this.email = user.email;
		this.avatarUrl = user.avatarUrl;
		this.nickname = user.nickname;
		this.role = user.role;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
	}
}
