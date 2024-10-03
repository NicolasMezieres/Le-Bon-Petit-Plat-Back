import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create() {
    return await this.prisma.user.create({
      data: {
        idRole: 'test',
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        username: 'username',
        password: 'test',
        gdpr: new Date(),
      },
    });
  }
  async findAll() {
    return await this.prisma.user.findMany();
  }
}
