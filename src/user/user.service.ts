import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateByAdminDTO, updateUserDTO } from './dto';
import { User } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }
  async update(dto: updateUserDTO, user: User) {
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
    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...dto,
      },
    });
    return 'Change successed';
  }
  async updateByAdmin(user: User, id: string, dto: updateByAdminDTO) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const existingCredentials = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });
    if (existingCredentials) {
      if (existingCredentials.email === dto.email) {
        throw new ForbiddenException('Email already taken');
      }
      if (existingCredentials.username === dto.username) {
        throw new ForbiddenException('Username already taken');
      }
    }
    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
    return 'Change successed';
  }
  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      throw new ForbiddenException('User not found');
    }
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return 'Successfull remove';
  }
}
