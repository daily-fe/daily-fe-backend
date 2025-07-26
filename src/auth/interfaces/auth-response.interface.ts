import { User } from '../../user/entities/user.entity';

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	accessTokenExpires: number;
	user: User;
}

export interface RefreshTokenResponse {
	accessToken: string;
	accessTokenExpires: number;
}
