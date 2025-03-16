import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';

import { Mail } from '@modules/mail/entities/mail.entity';
import { SendMailDto } from '@modules/mail/dto/send-mail.dto';
import { messages } from 'src/messages/messages';

@Injectable()
export class MailService {
  private transporter;

  private fromMail = '"PETS" <petsdevops@gmail.com>';
  private hostMail = process.env.BREVO_SMTP_HOST;
  private portMail = parseInt(process.env.BREVO_SMTP_PORT);
  private userMail = process.env.BREVO_SMTP_USER;
  private passwordMail = process.env.BREVO_SMTP_PASSWORD;
  private securityMail = false;
  private statusMailSucess: string = 'success';
  private statusMailFailed: string = 'failed';

  constructor(
    @InjectRepository(Mail)
    private mailRepository: Repository<Mail>,
  ) {
    // Se crea la instancia del servicio SMTP para el envio de correos configura con BREVO
    this.transporter = nodemailer.createTransport({
      host: this.hostMail,
      port: this.portMail,
      secure: this.securityMail,
      auth: {
        user: this.userMail,
        pass: this.passwordMail,
      },
    });
  }

  async sendMail(sendMailDto: SendMailDto) {
    const { recipient, action, subject, bodyMail } = sendMailDto;
    const recipients = Array.isArray(recipient) ? recipient : [recipient];

    const mailOptions = {
      from: this.fromMail,
      to: recipients.join(', '),
      subject,
      html: bodyMail,
    };

    const body = JSON.stringify({
      subject,
      bodyMail,
    });

    try {
      await this.transporter.sendMail(mailOptions);

      for (const recipient of recipients) {
        await this.mailRepository.save({
          recipient,
          action,
          status: this.statusMailSucess,
          body: body,
        });
      }

      return { message: messages.mailSendSuccess };
    } catch (error) {
      for (const recipient of recipients) {
        await this.mailRepository.save({
          recipient,
          action,
          status: this.statusMailFailed,
          errorMessage: error?.message || 'Unknow error',
          body: body,
        });
      }

      throw new Error(messages.mailSendFail);
    }
  }

  async getMailLogs() {
    return this.mailRepository.find();
  }
}
