import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/dto/CreateUserDto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registration(dto: CreateUserDto) {
    return this.usersService.creatUser(dto);
  }
}
