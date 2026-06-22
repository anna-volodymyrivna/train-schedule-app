/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Missing authorization header');
      }

      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid token format');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'SECRET',
      });

      request.user = {
        id: payload.sub || payload.id,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (err) {
      console.error('JWT Verification Error:', err);
      throw new UnauthorizedException('Invalid token or session expired');
    }
  }
}
