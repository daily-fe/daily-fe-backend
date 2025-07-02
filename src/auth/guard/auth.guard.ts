import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Public } from '../decorator/public.decorator';
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const isPublic = this.reflector.getAllAndOverride<boolean>(Public, [context.getHandler(), context.getClass()]);

		if (isPublic) {
			return true;
		}

		if (!request.user || request.user.type !== 'access') {
			return false;
		}
		return true;
	}
}
