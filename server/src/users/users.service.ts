import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      return await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: data.password,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          role: data.role as Role,
        },
      });
    } catch (error) {
      console.error('Critical database error while creating:', error);
      throw new ConflictException(
        'Failed to save user due to database failure',
      );
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
