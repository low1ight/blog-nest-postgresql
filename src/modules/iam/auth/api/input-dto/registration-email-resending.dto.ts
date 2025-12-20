import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegistrationEmailResendingDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
