import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserDto } from '../../users/dto/CreateUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUser() {}

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    const result = await this.authService.registration(dto);
    if (!result.isSuccessful) throw new BadRequestException(result.error);
    return result.content;
  }
}
