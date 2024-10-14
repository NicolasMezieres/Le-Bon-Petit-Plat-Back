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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(dto: signupDTO) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });
    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ForbiddenException('Email already taken');
      }
      if (existingUser.username === dto.username) {
        throw new ForbiddenException('Username already taken');
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
      throw new NotFoundException('Not found role');
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
    return 'Compte créer avec succès';
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
      existingEmail?.isActive === false ||
      existingUsername?.isActive === false
    ) {
      throw new ForbiddenException('Invalid credentials');
    }
    if (existingEmail) {
      const isValidPassword = await argon.verify(
        existingEmail.password,
        dto.password,
      );
      if (isValidPassword) {
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
        return await this.signToken(
          existingUsername.id,
          existingUsername.role.name,
          '1d',
        );
      }
    }
    throw new ForbiddenException('Invalid Credentials');
  }
  async signToken(
    idUser: string,
    nameRole: string,
    time: string,
  ): Promise<{ access_token: string }> {
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
    };
  }
  async activateAccount(token: string) {
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
    return 'Activation account';
  }
  async requestResetPassword(dto: requestResetPasswordDTO) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: true,
      },
    });
    const jwtToken = await this.signToken(
      existingEmail.id,
      existingEmail.role.name,
      '15m',
    );
    // si l'email n'est pas trouver j'envoie quand même le message email envoyé
    if (existingEmail) {
      await this.emailService.sendResetPassword(
        existingEmail,
        jwtToken.access_token,
      );
    }
    return 'Email envoyé';
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
    return 'Change password !';
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
      return 'identifier valide';
    }
  }
}
