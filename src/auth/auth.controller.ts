import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  requestResetPasswordDTO,
  resetPasswordDTO,
  signinDTO,
  signupDTO,
} from './dto';
import { JwtGuard } from './guards/jwt.guard';
import { GetUser } from './decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() dto: signupDTO) {
    return this.authService.signup(dto);
  }

  @Post('/signin')
  signin(@Body() dto: signinDTO) {
    return this.authService.signin(dto);
  }

  @Get('/isUsed')
  isExistingIdentifier(@Query() query: string) {
    return this.authService.isExistingIdentifier(query);
  }
  @Get('/activate/:token')
  activateAccount(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }
  @Post('/requestResetPassword')
  requestResetPassword(@Body() dto: requestResetPasswordDTO) {
    return this.authService.requestResetPassword(dto);
  }
  @UseGuards(JwtGuard)
  @Patch('/resetPassword')
  resetPassword(@Body() dto: resetPasswordDTO, @GetUser() user: User) {
    return this.authService.resetPassword(dto, user);
  }
}
