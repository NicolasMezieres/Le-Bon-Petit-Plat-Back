import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateByAdminDTO, updateUserDTO } from './dto';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { isNextPage, pagination } from 'utils/pagination';
import { count } from 'console';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const skip = pagination(query.page, 10);
    const userList = await this.prisma.user.findMany({
      skip: skip,
      take: 10,
      select: {
        createdAt: true,
        email: true,
        favoriteRecipe: true,
        firstName: true,
        gdpr: true,
        id: true,
        isActive: true,
        lastName: true,
        updatedAt: true,
        username: true,
      },
    });
    const countUser = await this.prisma.user.count();
    const nextPage = isNextPage(query.page, countUser, 10);
    return { data: userList, total: countUser, isNextPage: nextPage };
  }
  async search(query: { page: number; search: string }) {
    const skip = pagination(query.page, 10);
    const userList = await this.prisma.user.findMany({
      skip: skip,
      take: 10,
      where: {
        OR: [
          { firstName: { contains: query.search } },
          { lastName: { contains: query.search } },
          { username: { contains: query.search } },
          { email: { contains: query.search } },
        ],
      },
      select: {
        createdAt: true,
        email: true,
        favoriteRecipe: true,
        firstName: true,
        gdpr: true,
        id: true,
        isActive: true,
        lastName: true,
        updatedAt: true,
        username: true,
      },
    });
    const countUser = await this.prisma.user.count({
      where: {
        OR: [
          { firstName: { contains: query.search } },
          { lastName: { contains: query.search } },
          { username: { contains: query.search } },
          { email: { contains: query.search } },
        ],
      },
    });
    const nextPage = isNextPage(query.page, countUser, 10);
    return { data: userList, total: countUser, isNextPage: nextPage };
  }
  async myInfo(user: User) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (existingUser) {
      delete existingUser.idRole;
      delete existingUser.password;
      delete existingUser.isActive;
      delete existingUser.token;
      return existingUser;
    }
    throw new UnauthorizedException("Vous n'êtes pas autorisé");
  }
  async update(dto: updateUserDTO, user: User) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });
    console.log(existingUser.username, existingUser.email);
    console.log(dto.username, dto.email);
    console.log(user.username, user.email);
    if (existingUser) {
      if (
        existingUser.email === dto.email &&
        existingUser.email !== user.email
      ) {
        throw new ForbiddenException('Email déjà pris');
      }
      if (
        existingUser.username === dto.username &&
        existingUser.username !== user.username
      ) {
        throw new ForbiddenException("Nom d'utilisateur déjà pris");
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
    return { message: 'Modifications effectuées' };
  }
  async updateByAdmin(user: User, id: string, dto: updateByAdminDTO) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    const existingCredentials = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });
    if (existingCredentials) {
      if (
        existingCredentials.email === dto.email &&
        existingUser.email !== existingCredentials.email
      ) {
        throw new ForbiddenException('Email déjà pris');
      }
      if (
        existingCredentials.username === dto.username &&
        existingUser.email !== existingCredentials.email
      ) {
        throw new ForbiddenException("Nom d'utilisateur déjà pris");
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
    return { message: 'Modification effectué' };
  }
  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      throw new ForbiddenException('Utilisateur introuvable');
    }
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return { message: 'Utilisateur supprimé' };
  }
}
