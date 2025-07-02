import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info, context: ExecutionContext) {
		console.log('user', user);
		return user;
	}
}
