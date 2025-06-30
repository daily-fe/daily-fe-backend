import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BearerTokenMiddleware } from './auth/middleware/beare-token.middleware';
import { BlogModule } from './blog/blog.module';
import { GeminiModule } from './gemini/gemini.module';
import { ScraperModule } from './scraper/scraper.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				ENV: Joi.string().valid('dev', 'prod').required(),
				DB_TYPE: Joi.string().valid('postgres').required(),
				DB_HOST: Joi.string().required(),
				DB_PORT: Joi.number().required(),
				DB_USERNAME: Joi.string().required(),
				DB_PASSWORD: Joi.string().required(),
				DB_DATABASE: Joi.string().required(),
				HASH_ROUNDS: Joi.number().required(),
				ACCESS_TOKEN_SECRET: Joi.string().required(),
				REFRESH_TOKEN_SECRET: Joi.string().required(),
				GEMINI_API_KEY: Joi.string().required(),
			}),
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				host: config.get<string>('DB_HOST'),
				port: config.get<number>('DB_PORT'),
				username: config.get<string>('DB_USERNAME'),
				password: config.get<string>('DB_PASSWORD'),
				database: config.get<string>('DB_DATABASE'),
				autoLoadEntities: true,
				// TODO 개발 환경에서만 true
				synchronize: true,
				entities: [User],
			}),
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('ACCESS_TOKEN_SECRET'),
				signOptions: { expiresIn: '5m' },
			}),
		}),
		GeminiModule,
		ScraperModule,
		BlogModule,
		UserModule,
		AuthModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(BearerTokenMiddleware)
			.exclude(
				{ path: 'auth/login', method: RequestMethod.POST },
				{ path: 'auth/register', method: RequestMethod.POST },
				{ path: 'auth/refresh', method: RequestMethod.POST },
			)
			.forRoutes('*');
	}
}
