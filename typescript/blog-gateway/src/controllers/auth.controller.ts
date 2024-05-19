import { Body, Controller, Post } from '@nestjs/common';

import { LoginRequest, RegisterRequest } from 'src/micros/auth';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginRequest) {
    return await this.authService.login(payload);
  }

  @Post('register')
  async register(@Body() payload: RegisterRequest) {
    return await this.authService.register(payload);
  }
}
