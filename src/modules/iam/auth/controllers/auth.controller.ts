import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUser() {
    return 'test';
  }

  @Post('registration')
  async registration(
    @Body('password') password: string,
    @Body('email') email: string,
    @Body('login') login: string,
  ) {
    await this.authService.registration({ password, email, login });
    return;
  }
}
