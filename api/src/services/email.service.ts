import Mail from 'nodemailer/lib/mailer';
import config from '../config';
import { Confirmation } from '../types/Auth';
import nodemailer, { SentMessageInfo } from 'nodemailer';

// Free email service
export class EmailService {
  transporter: Mail<SentMessageInfo>;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.email,
        pass: config.emailPassword,
      },
    });
  }

  async sendConfirmationEmail(confirm: Confirmation, username: string) {
    const mailOptions = {
      from: config.email,
      to: username,
      subject: 'Confirm your CariCare email',
      text: `Enter code: ${confirm.code} at link link https:caricare.com/confirm/${confirm.id} to verify your email`,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendNewAppointmentNotification(username: string, patientName: string, date: string) {
    // TODO add mail service
    const mailOptions = {
      from: config.email,
      to: username,
      subject: `New Appointment Invitation from ${patientName} `,
      text: `${patientName} has send an appointment invitation you to on ${date}. Login to see details and confirmed or deny appointment.`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
