import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailAdapter {
  sendEmail(email: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
        pass: '',
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
