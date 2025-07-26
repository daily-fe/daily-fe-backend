import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			next();
			return;
		}
		const token = this.validateBearerToken(authHeader);

		const decodedToken = this.jwtService.decode(token);

		if (decodedToken.type !== 'refresh' && decodedToken.type !== 'access') {
			throw new UnauthorizedException('Invalid token');
		}

		try {
			const secretKey: string =
				decodedToken.type === 'refresh'
					? this.configService.get<string>('REFRESH_TOKEN_SECRET')!
					: this.configService.get<string>('ACCESS_TOKEN_SECRET')!;

			const payload = await this.jwtService.verify(token, {
				secret: secretKey,
			});

			const isRefreshToken = decodedToken.type === 'refresh';

			if (isRefreshToken) {
				if (payload.type !== 'refresh') {
					throw new BadRequestException('Invalid refreshtoken');
				}
			} else {
				if (payload.type !== 'access') {
					throw new BadRequestException('Invalid access token');
				}
			}

			req['user'] = payload;
			next();
		} catch (e) {
			if (e.name === 'TokenExpiredError') {
				throw new UnauthorizedException('Token expired');
			}
			next();
		}
	}

	validateBearerToken(rawToken: string) {
		const bearerSplit = rawToken.split(' ');

		if (bearerSplit.length !== 2) {
			throw new BadRequestException('Invalid token');
		}

		const [bearer, token] = bearerSplit;

		if (bearer.toLowerCase() !== 'bearer') {
			throw new BadRequestException('Invalid token');
		}

		return token;
	}
}
