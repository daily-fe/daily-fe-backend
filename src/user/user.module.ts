import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserUseCase } from './services/create-user.usecase';
import { FindAllUsersUseCase } from './services/find-all-users.usecase';
import { FindUserByGithubIdUseCase } from './services/find-user-by-github-id.usecase';
import { UpdateUserUseCase } from './services/update-user.usecase';
import { UserController } from './user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [FindAllUsersUseCase, CreateUserUseCase, FindUserByGithubIdUseCase, UpdateUserUseCase],
	controllers: [UserController],
	exports: [FindAllUsersUseCase, CreateUserUseCase, FindUserByGithubIdUseCase, UpdateUserUseCase],
})
export class UserModule {}
