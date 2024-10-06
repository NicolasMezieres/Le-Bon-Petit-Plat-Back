import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
