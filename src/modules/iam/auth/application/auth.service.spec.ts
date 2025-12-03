import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DevicesService } from '../../devices/application/devices.service';
import { UsersService } from '../../users/application/users.service';
import { UsersRepository } from '../../users/repositories/users.repository';
import { PasswordHashService } from '../../../../core/services/passwordHash/password-hash.service';
import { TokenService } from '../../../../core/services/jwt/token.service';
import { EmailService } from '../../../../core/services/email/email.service';
import { Result } from '../../../../core/helpers/result/result';
import { ResultInputError } from '../../../../core/helpers/result/result-error';

describe('AuthService', () => {
  let service: AuthService;

  //mocked services

  const mockedEmailService = {
    sendRegistrationCode: jest.fn(),
  };

  const mockedDeviceService = {
    createDevice: jest.fn(),
  };

  const mockedUsersService = {
    createUser: jest.fn(),
  };

  const mockedUsersRepository = {
    getUserByEmailOrLogin: jest.fn(),
  };

  const mockedPasswordHashService = {
    compare: jest.fn(),
  };

  const mockedTokenService = {
    createTokensPair: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: EmailService, useValue: mockedEmailService },
        { provide: DevicesService, useValue: mockedDeviceService },
        { provide: UsersService, useValue: mockedUsersService },
        { provide: UsersRepository, useValue: mockedUsersRepository },
        { provide: PasswordHashService, useValue: mockedPasswordHashService },
        { provide: TokenService, useValue: mockedTokenService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registration', () => {
    it('should return unsuccessful result object if user not created', async () => {
      mockedUsersService.createUser.mockReturnValue(
        Result.fail(new ResultInputError('err message', 'err field')),
      );

      const result = await service.registration({
        login: 'qwerty',
        email: 'qwerty@gmail.com',
        password: 'password1234',
      });

      expect(result.isSuccessful).toBe(false);
    });

    it('should return unsuccessful result object if user not created', async () => {
      mockedUsersService.createUser.mockReturnValue(
        Result.ok('=registration code='),
      );

      const result = await service.registration({
        login: 'qwerty',
        email: 'qwerty@gmail.com',
        password: 'password1234',
      });

      expect(result.isSuccessful).toBe(true);
    });
  });

  describe('validate user', () => {
    it('should return null if user not found', async () => {
      mockedUsersRepository.getUserByEmailOrLogin.mockReturnValue(null);

      const result = await service.validateUser('wrongLogin', 'password');

      expect(result).toBeNull();
    });

    it('should return null if the password wrong', async () => {
      mockedUsersRepository.getUserByEmailOrLogin.mockReturnValue({
        id: 1,
        login: 'qwerty',
        email: 'qwerty@gmail.com',
        password: 'passwordHash',
        createdAt: 'randomDateString',
      });

      mockedPasswordHashService.compare.mockReturnValue(false);

      const result = await service.validateUser('login', 'wrongPassword');

      expect(result).toBeFalsy();
    });

    it('should return user if the password correct', async () => {
      mockedUsersRepository.getUserByEmailOrLogin.mockReturnValue({
        id: 1,
        login: 'qwerty',
        email: 'qwerty@gmail.com',
        password: 'passwordHash',
        createdAt: 'randomDateString',
      });

      mockedPasswordHashService.compare.mockReturnValue(true);

      const result = await service.validateUser('login', 'correctPassword');

      expect(result).toEqual({
        id: 1,
        login: 'qwerty',
        email: 'qwerty@gmail.com',
        password: 'passwordHash',
        createdAt: 'randomDateString',
      });
    });
  });
});
