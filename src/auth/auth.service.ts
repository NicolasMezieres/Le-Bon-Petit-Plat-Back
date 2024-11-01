import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  requestResetPasswordDTO,
  resetPasswordDTO,
  signinDTO,
  signupDTO,
} from './dto';
import * as argon from 'argon2';
import { Role } from 'utils/const';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(dto: signupDTO) {
    console.log('test');
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });
    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ForbiddenException('Email déjà pris');
      }
      if (existingUser.username === dto.username) {
        throw new ForbiddenException('Email déjà pris');
      }
    }
    const hash = await argon.hash(dto.password);
    const token = await argon.hash(dto.email);
    const newToken = token.replaceAll('/', '');
    const userRole = await this.prisma.role.findUnique({
      where: {
        name: Role.USER,
      },
    });
    if (!userRole) {
      throw new NotFoundException('Role introuvable');
    }
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
        token: newToken,
        idRole: userRole.id,
        gdpr: new Date(),
      },
    });
    await this.emailService.sendUserConfirmation(user, newToken);
    return `Vous aller recevoir un mail de confirmation.`;
  }
  async signin(dto: signinDTO) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.identifier },
      include: {
        role: true,
      },
    });
    const existingUsername = await this.prisma.user.findUnique({
      where: {
        username: dto.identifier,
      },
      include: {
        role: true,
      },
    });
    if (
      (!existingEmail && !existingUsername) ||
      (existingEmail?.isActive === false && !existingEmail?.token) ||
      (existingUsername?.isActive === false && !existingUsername?.token)
    ) {
      throw new ForbiddenException('Identifiant incorrect');
    }
    if (existingEmail) {
      const isValidPassword = await argon.verify(
        existingEmail.password,
        dto.password,
      );
      if (isValidPassword) {
        if (existingEmail?.isActive === false) {
          throw new ForbiddenException(
            "Votre compte n'est pas activé. Veuillez consulter vos emails.",
          );
        }
        return await this.signToken(
          existingEmail.id,
          existingEmail.role.name,
          '1d',
        );
      }
    }
    if (existingUsername) {
      const isValidPassword = await argon.verify(
        existingUsername.password,
        dto.password,
      );
      if (isValidPassword) {
        if (existingUsername?.isActive === false) {
          throw new ForbiddenException(
            "Votre compte n'est pas activé. Veuillez consulter vos emails.",
          );
        }
        return await this.signToken(
          existingUsername.id,
          existingUsername.role.name,
          '1d',
        );
      }
    }
    throw new ForbiddenException('Identifiant incorrect');
  }
  async signToken(
    idUser: string,
    nameRole: string,
    time: string,
  ): Promise<{ access_token: string; message: string }> {
    const payload = {
      sub: idUser,
      role: nameRole,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: time,
      secret: secret,
    });
    return {
      access_token: token,
      message: 'Connexion réussie',
    };
  }
  async activateAccount(token: string, res: Response) {
    const existingToken = await this.prisma.user.findFirst({
      where: {
        token: token,
      },
    });
    if (!existingToken) {
      throw new ForbiddenException('Not found ici');
    }
    await this.prisma.user.update({
      where: {
        id: existingToken.id,
      },
      data: {
        token: null,
        isActive: true,
      },
    });
    return res.redirect('http://localhost:3001/signin');
  }
  async requestResetPassword(dto: requestResetPasswordDTO) {
    console.log(dto);
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: true,
      },
    });
    if (existingEmail) {
      const jwtToken = await this.signToken(
        existingEmail.id,
        existingEmail.role.name,
        '15m',
      );
      // si l'email n'est pas trouver j'envoie quand même le message email envoyé

      await this.emailService.sendResetPassword(
        existingEmail,
        jwtToken.access_token,
      );
    }
    return { message: 'Email envoyé' };
  }
  async resetPassword(dto: resetPasswordDTO, user: User) {
    const newPassword = await argon.hash(dto.password);
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });
    return { message: 'Mot de passe modifier !' };
  }
  async isExistingIdentifier(query: any) {
    const isExistingIdentifier = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: query.identifier,
          },
          {
            email: query.identifier,
          },
        ],
      },
    });
    if (
      isExistingIdentifier &&
      isExistingIdentifier.email === query.identifier
    ) {
      throw new ForbiddenException('Email already taken');
    } else if (
      isExistingIdentifier &&
      isExistingIdentifier.username === query.identifier
    ) {
      throw new ForbiddenException('Username already taken');
    } else {
      return { message: 'identifiant valide' };
    }
  }
}
