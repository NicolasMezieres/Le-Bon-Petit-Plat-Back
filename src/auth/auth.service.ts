import { ForbiddenException, Injectable } from '@nestjs/common';
import { signupDTO } from './dto';
import * as argon from 'argon2';
import { Role } from 'utils/const';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private emailService: EmailService
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
      console.log("Role User doesn't exist");
      throw new Error('Error serveur');
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
    await this.emailService.sendUserConfirmation(user, token)
    return "Compte créer avec succès"
  }
}
