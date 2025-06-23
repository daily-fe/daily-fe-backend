import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	// 임시로 모든 출처에서 허용되도록 설정
	// TODO
	app.enableCors();
	await app.listen(3000);
}
bootstrap();
