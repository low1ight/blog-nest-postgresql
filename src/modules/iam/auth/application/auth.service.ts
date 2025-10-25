import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registration(dto) {
    return this.usersService.creatUser(dto);
  }
}
