import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { PasswordHashService } from '../../../../core/services/passwordHash/password-hash.service';
import { UsersPasswordRecoveryRepository } from '../infrastructure/users-password-recovery.repository';
import { NewPasswordDto } from '../../auth/api/input-dto/new-password.dto';
import { UserPasswordRecovery } from '../domain/user-password-recovery.entity';
import { isDateExpired } from '../../../../core/utils/is-date-expired';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly userPasswordRecoveryRepository: UsersPasswordRecoveryRepository,
  ) {}

  async getUserByEmailOrLogin(email: string) {
    return await this.usersRepository.getUserByEmailOrLogin(email);
  }

  async setNewPassword({
    newPassword,
    recoveryCode,
  }: NewPasswordDto): Promise<boolean> {
    const userPasswordRecovery: UserPasswordRecovery | null =
      await this.userPasswordRecoveryRepository.getByRecoveryCode(recoveryCode);

    if (!userPasswordRecovery) return false;

    if (isDateExpired(userPasswordRecovery.codeExpirationDate)) return false;

    const newPasswordHash = await this.passwordHashService.hash(newPassword);

    await this.usersRepository.updateUserPasswordById(
      userPasswordRecovery.userId,
      newPasswordHash,
    );

    return true;
  }

  async setPasswordRecoveryCode(
    userId: number,
    recoveryCode: string,
    expirationDate: string,
  ) {
    await this.userPasswordRecoveryRepository.updatePasswordRecovery(
      userId,
      recoveryCode,
      expirationDate,
    );
  }
}
