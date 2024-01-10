import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  // private transporter: nodemailer.Transporter;
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendChangePasswordEmail(email: string, token: string): Promise<void> {
    const changePasswordUrl = `${this.configService.get(
      'APP_URL',
    )}/change-password?token=${token}`;
    await this.mailerService.sendMail({
      from: '"GaelO-Flow" <' + this.configService.get('MAIL_FROM') + '>',
      to: email,
      subject: 'Change your password',
      html: `Follow this link to set your password : <a href="${changePasswordUrl}">${changePasswordUrl}</a>`,
    });
  }
}
