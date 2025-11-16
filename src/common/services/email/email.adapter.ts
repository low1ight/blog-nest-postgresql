import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailConfig } from './email.config';

@Injectable()
export class EmailAdapter {
  constructor(private readonly emailConfig: EmailConfig) {}

  sendEmail(email: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.emailConfig.nodemailerUser,
        pass: this.emailConfig.nodemailerPassword,
      },
    });

    transporter
      .sendMail({
        from: 'Blog API',
        to: email,
        subject: subject,
        text: 'Blog API',
        html: html, // HTML body
      })
      .then();
  }
}
