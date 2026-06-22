import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TrainsModule } from './trains/trains.module';

@Module({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TrainsModule],
})
export class AppModule {}
