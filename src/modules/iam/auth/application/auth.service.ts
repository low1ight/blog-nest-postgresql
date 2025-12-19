import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { EmailService } from '../../../../core/services/email/email.service';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { PasswordHashService } from '../../../../core/services/passwordHash/password-hash.service';
import { UserDocumentModel } from '../../users/dto/user-document.model';
import { UserLoginModel } from '../../../../core/dto/user-login.model';
import { TokenService } from '../../../../core/services/jwt/token.service';
import { DevicesService } from '../../devices/application/devices.service';
import { randomUUID } from 'crypto';
import { createExpirationDate } from '../../../../core/utils/create-expiration-date';
import { NewPasswordDto } from '../api/input-dto/new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailManager: EmailService,
    private readonly userRepository: UsersRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly tokenService: TokenService,
    private readonly deviceService: DevicesService,
  ) {}

  async logout(deviceId: number) {
    return await this.deviceService.deleteDeviceById(deviceId);
  }

  async refreshToken(userId: number, deviceId: number) {
    const sessionId: string = randomUUID();
    const date = new Date().toISOString();

    await this.deviceService.updateDevice(deviceId, sessionId, date);
    return await this.tokenService.createTokensPair(
      userId,
      deviceId,
      sessionId,
    );
  }

  async validateUser(loginOrEmail: string, password: string) {
    const user: UserDocumentModel | null =
      await this.userRepository.getUserByEmailOrLogin(loginOrEmail);

    if (!user) return null;

    const isPasswordMatch: boolean = await this.passwordHashService.compare(
      password,
      user.password,
    );

    if (!isPasswordMatch) return null;

    return user;
  }

  async passwordRecovery(email: string) {
    const user = await this.usersService.getUserByEmailOrLogin(email);
    if (!user) return;

    const recoveryCode: string = randomUUID();
    //todo add recovery code time env
    const expirationDate = createExpirationDate(15);

    await this.usersService.setPasswordRecoveryCode(
      user.id,
      recoveryCode,
      expirationDate,
    );

    this.emailManager.sendPasswordRecoveryCode(email, recoveryCode);
  }

  async setNewPassword(dto: NewPasswordDto) {
    return await this.usersService.setNewPassword(dto);
  }
}
