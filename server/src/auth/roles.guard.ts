/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as any;
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Not authorized');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admins only.');
    }

    return true;
  }
}
