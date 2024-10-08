import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAdminStrategy } from 'src/auth/strategy/admin.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtAdminStrategy],
})
export class UserModule {}
