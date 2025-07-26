import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { ArticleLike } from './article/entities/article-like.entity';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guard/auth.guard';
import { BearerTokenMiddleware } from './auth/middleware/beare-token.middleware';
import { Feed } from './feed/entities/feed.entity';
import { FeedSource } from './feed/entities/feed-source.entity';
import { FeedModule } from './feed/feed.module';
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
				// DATABASE_URL 또는 개별 DB 설정 중 하나는 필수
				DATABASE_URL: Joi.string().optional(),
				DB_TYPE: Joi.string().valid('postgres').optional(),
				DB_HOST: Joi.string().optional(),
				DB_PORT: Joi.number().optional(),
				DB_USERNAME: Joi.string().optional(),
				DB_PASSWORD: Joi.string().optional(),
				DB_DATABASE: Joi.string().optional(),
				HASH_ROUNDS: Joi.number().required(),
				ACCESS_TOKEN_SECRET: Joi.string().required(),
				REFRESH_TOKEN_SECRET: Joi.string().required(),
				GEMINI_API_KEY: Joi.string().required(),
			}).custom((value, helpers) => {
				// DATABASE_URL이 없으면 개별 DB 설정이 모두 있어야 함
				if (!value.DATABASE_URL) {
					if (
						!value.DB_HOST ||
						!value.DB_PORT ||
						!value.DB_USERNAME ||
						!value.DB_PASSWORD ||
						!value.DB_DATABASE
					) {
						return helpers.error('DATABASE_URL 또는 개별 DB 설정이 필요합니다');
					}
				}
				return value;
			}),
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				const databaseUrl = config.get<string>('DATABASE_URL');

				if (databaseUrl) {
					// DATABASE_URL이 있는 경우 (Vercel 등)
					return {
						type: 'postgres',
						url: databaseUrl,
						autoLoadEntities: true,
						synchronize: false,
						entities: [User, Article, ArticleLike, Feed, FeedSource],
						ssl: {
							rejectUnauthorized: true,
						},
					};
				} else {
					// 개별 환경 변수 사용 (로컬 개발)
					return {
						type: 'postgres',
						host: config.get<string>('DB_HOST'),
						port: config.get<number>('DB_PORT'),
						username: config.get<string>('DB_USERNAME'),
						password: config.get<string>('DB_PASSWORD'),
						database: config.get<string>('DB_DATABASE'),
						autoLoadEntities: true,
						synchronize: true,
						entities: [User, Article, ArticleLike, Feed, FeedSource],
					};
				}
			},
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
		ArticleModule,
		UserModule,
		AuthModule,
		FeedModule,
	],
	controllers: [],
	providers: [
		AppService,
		Logger,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(BearerTokenMiddleware)
			.exclude(
				{ path: 'auth/login', method: RequestMethod.POST },
				{ path: 'auth/register', method: RequestMethod.POST },
				{ path: 'auth/refresh', method: RequestMethod.POST },
				{ path: 'blog', method: RequestMethod.GET },
			)
			.forRoutes('*');
	}
}
