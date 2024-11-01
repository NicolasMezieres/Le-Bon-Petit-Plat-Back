import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: Number(this.config.get('SMTP_PORT')),
      secure: process.env.MAILER_SECURE === 'false',
      auth: {
        user: this.config.get('SMTP_EMAIL'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendUserConfirmation(user: User, token: string) {
    const url = `${process.env.SERVER_URL}/auth/activate/${token}`;
    const emailHTML = `<img style="display: block;margin-left: auto;margin-right: auto;" src="cid:Chellil" width="200" height="100"/>
    <p style="text-align: center;font-weight: bolder; font-family:lato;">${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)} ${user.firstName}</p>
    <br/>
    <p style="text-align: center; font-family:lato;" >Votre Inscription est presque terminer !</p>
    <p style="text-align: center; font-family:lato;">Pour terminer votre inscription cliquer <a href=${url}>ici</a>.</p>
    <p style="text-align: center; font-family:lato;">Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer ce message.</p>`;

    await this.transporter.sendMail({
      from: this.config.get('SMTP_EMAIL'),
      to: user.email,
      subject: 'Votre inscription est presque terminer !',
      html: emailHTML,
      attachments: [
        {
          filename: 'image.png',
          path: './src/view/LeBonPetitPlat.png',
          cid: 'Chellil',
        },
      ],
    });
  }
  async sendResetPassword(user: User, token: string) {
    const url = `${process.env.FRONT_URL}/resetPassword/${token}`;
    const emailHTML = `<img style="display: block;margin-left: auto;margin-right: auto;" src="cid:Chellil" width="200" height="100"/>
    <p style="text-align: center;font-weight: bolder; font-family:lato;">${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)} ${user.firstName}</p>
    <br/>
    <p style="text-align: center; font-family:lato;" >Vous avez fait une demande de changement de mot de passe !</p>
    <p style="text-align: center; font-family:lato;">Pour changer votre mot de passe cliquer <a href=${url}>ici</a>.</p>
    <p style="text-align: center; font-family:lato;">Ce lien n'est valable que 15 minutes !</p>
    <p style="text-align: center; font-family:lato;">Si vous n'êtes pas à l'origine de cette demande de changement de mot de passe, vous pouvez ignorer ce message.</p>`;

    await this.transporter.sendMail({
      from: this.config.get('SMTP_EMAIL'),
      to: user.email,
      subject: 'Demande de changement de mot de passe !',
      html: emailHTML,
      attachments: [
        {
          filename: 'image.png',
          path: './src/view/LeBonPetitPlat.png',
          cid: 'Chellil',
        },
      ],
    });
  }
}
