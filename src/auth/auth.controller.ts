import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDTO, signupDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: signupDTO) {
    return this.authService.signup(dto);
  }

  // @Post('signin')
  // signin(@Body() dto: signinDTO) {
  //   return this.authService.signin(dto)
  // }
}
