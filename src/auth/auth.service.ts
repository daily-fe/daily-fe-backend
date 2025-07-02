import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { GithubLoginDto } from './dto/github-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

const ACCESS_TOKEN_EXPIRES = {
	ms: 5 * 60 * 1000,
	str: '5m',
};
const REFRESH_TOKEN_EXPIRES = {
	ms: 24 * 60 * 60 * 1000,
	str: '24h',
};

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {}

	async validateOrCreateUser(githubProfile: any): Promise<User> {
		let user = await this.userService.findByGithubId(githubProfile.id);
		if (!user) {
			user = await this.userService.create({
				githubId: githubProfile.id,
				username: githubProfile.username,
				email: githubProfile.emails?.[0]?.value,
			});
		}
		return user;
	}

	async login(user: User) {
		const payload = { sub: user.id, username: user.username };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async loginWithGithub(params: GithubLoginDto) {
		let user = await this.userService.findByGithubId(params.githubId);
		if (user) {
			user.username = params.username ?? user.username;
			user.email = params.email ?? user.email;
			user.avatarUrl = params.avatarUrl ?? user.avatarUrl;
			user = await this.userService.update(user);
		} else {
			user = await this.userService.create(params);
		}

		const { token: accessToken, expires: accessTokenExpires } = await this.issueToken(user, false);
		const { token: refreshToken } = await this.issueToken(user, true);

		return {
			accessToken,
			refreshToken,
			accessTokenExpires,
		};
	}

	async issueToken(
		user: {
			id: number;
			role: Role;
		},
		isRefreshToken: boolean,
	) {
		const refreshTokenSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
		const accessTokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
		return {
			token: await this.jwtService.signAsync(
				{
					sub: user.id,
					role: user.role,
					type: isRefreshToken ? 'refresh' : 'access',
				},
				{
					secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
					expiresIn: isRefreshToken ? REFRESH_TOKEN_EXPIRES.str : ACCESS_TOKEN_EXPIRES.str,
				},
			),
			expires: Date.now() + (isRefreshToken ? REFRESH_TOKEN_EXPIRES.ms : ACCESS_TOKEN_EXPIRES.ms),
		};
	}

	async refreshAccessToken({ refreshToken }: RefreshTokenDto) {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
			});
			if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type');
			const { token: accessToken, expires: accessTokenExpires } = await this.issueToken(
				{ id: payload.sub, role: payload.role },
				false,
			);
			return { accessToken, accessTokenExpires, refreshToken };
		} catch (e) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}
}
