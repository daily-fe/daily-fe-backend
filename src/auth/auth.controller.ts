import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { GithubLoginDto } from './dto/github-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginResponse, RefreshTokenResponse } from './interfaces/auth-response.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('login/github')
	async loginWithGithub(@Body() body: GithubLoginDto): Promise<LoginResponse> {
		return this.authService.loginWithGithub(body);
	}

	@Public()
	@Post('refresh')
	async refreshAccessToken(@Body() body: RefreshTokenDto): Promise<RefreshTokenResponse> {
		return this.authService.refreshAccessToken(body);
	}
}
