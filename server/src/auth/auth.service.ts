import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: { username: string; email: string; password: string }) {
    return this.usersService.create({
      ...body,
      role: 'user',
    });
  }

  async login(body: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user || user.password !== body.password) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
