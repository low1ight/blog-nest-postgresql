import { Injectable } from '@nestjs/common';
import { EmailAdapter } from './email.adapter';

@Injectable()
export class EmailService {
  constructor(private readonly emailAdapter: EmailAdapter) {}

  sendRegistrationCode(email: string, code: string) {
    this.emailAdapter.sendEmail(
      email,
      'Please Confirm Your Account',
      `<h1>Enter the following code: ${code}</h1>`,
    );
  }

  sendPasswordRecoveryCode(email: string, code: string) {
    this.emailAdapter.sendEmail(
      email,
      'Password Recovery',
      `<h1>Enter the following code: ${code}</h1>`,
    );
  }
}
