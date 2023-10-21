import Mail from 'nodemailer/lib/mailer';
import config from '../config';
import { Confirmation } from '../types/Auth';
import nodemailer, { SentMessageInfo } from 'nodemailer';

export class EmailService {
  transporter: Mail<SentMessageInfo>;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.emailPassword,
      },
    });
  }

  async sendConfirmationEmail(confirm: Confirmation, username: string) {
    // TODO add mail service
    return true;
    // const mailOptions = {
    //   from: config.email,
    //   to: username,
    //   subject: 'Confirm your CariCare username',
    //   text: `Enter code: ${confirm.code} or click link https:caricare.com/confirm/${confirm.id}/${confirm.code}`,
    // };

    // return await this.transporter.sendMail(mailOptions);
  }
}
