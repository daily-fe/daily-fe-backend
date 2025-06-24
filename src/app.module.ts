import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { GeminiModule } from './gemini/gemini.module';
import { ScraperModule } from './scraper/scraper.module';

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
				host: config.get<string>('DB_HOST', 'localhost'),
				port: +config.get<number>('DB_PORT', 5432),
				username: config.get<string>('DB_USERNAME', 'postgres'),
				password: config.get<string>('DB_PASSWORD', ''),
				database: config.get<string>('DB_DATABASE', 'daily'),
				autoLoadEntities: true,
				// TODO 개발 환경에서만 true
				synchronize: true,
			}),
		}),
		GeminiModule,
		ScraperModule,
		BlogModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
