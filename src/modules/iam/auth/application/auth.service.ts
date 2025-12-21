import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { PasswordHashService } from '../../users/providers/passwordHash/password-hash.service';
import { User } from '../../users/domain/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async validateUser(loginOrEmail: string, password: string) {
    const user: User | null =
      await this.userRepository.getUserByEmailOrLogin(loginOrEmail);

    if (!user) return null;

    const isPasswordMatch: boolean = await this.passwordHashService.compare(
      password,
      user.password,
    );

    if (!isPasswordMatch) return null;

    return user;
  }
}
