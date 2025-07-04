import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserUseCase } from './services/update-user.usecase';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService, UpdateUserUseCase],
	controllers: [UserController],
	exports: [UserService, UpdateUserUseCase],
})
export class UserModule {}
