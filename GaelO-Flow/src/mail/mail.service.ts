import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
// import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    // private transporter: nodemailer.Transporter;
    constructor(private mailerService:MailerService) {}
    // constructor() {
    //     this.transporter = nodemailer.createTransport({
    //         host: 'smtp.gmail.com',
    //         port: 2525,
    //         auth: {
    //             user: process.env.MAILTRAP_USER,
    //             pass: process.env.MAILTRAP_PASSWORD,
    //         },
    //     });
    // }

    async sendConfirmationEmail(email: string, token: string): Promise<void> {
        const confirmationUrl = `http://localhost:3000/confirm?token=${token}`;
        await this.mailerService.sendMail({
            from:'"GaelO-Flow" <noreply@gaeloflow.com>',
            to: email,
            subject: 'Confirmez votre email',
            html: `Veuillez cliquer sur le lien suivant pour confirmer votre compte : <a href="${confirmationUrl}">${confirmationUrl}</a>`,
        });
    }
}
