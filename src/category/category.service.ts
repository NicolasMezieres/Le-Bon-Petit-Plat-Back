import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { createCategoryDTO, updateCategoryDTO } from './dto';
import { error } from 'console';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.$queryRaw<Category[]>`SELECT * FROM "Category" `;
  }

  async create(dto: createCategoryDTO) {
    const existingCategory = await this.prisma
      .$executeRaw<Category>`SELECT "name" FROM "Category" WHERE "name" = ${dto.name}`;
    if (existingCategory[0]) {
      throw new ForbiddenException('Name already taken');
    }
    const id = uuidv4();
    const res = await this.prisma
      .$executeRaw`INSERT INTO "Category" ("id","name") VALUES (${id},${dto.name})`;
    if (res === 1) {
      return 'Category created';
    }
    throw new error();
  }

  async update(id: string, dto: updateCategoryDTO) {
    const existingCategory = await this.prisma
      .$queryRaw<Category>`SELECT * FROM "Category" WHERE "id" = ${id}`;
    if (!existingCategory[0]) {
      throw new NotFoundException('Not found');
    }
    const existingName = await this.prisma
      .$queryRaw<Category>`SELECT * FROM "Category" WHERE "name" = ${dto.name}`;
    if (existingName[0] && existingCategory[0].name !== dto.name) {
      throw new ForbiddenException('Name already taken');
    }
    const res = await this.prisma
      .$executeRaw<Category>`UPDATE "Category" SET "name" = ${dto.name} WHERE "id" = ${existingCategory[0].id} `;
    if (res === 1) {
      return 'Successfully updated';
    }
    throw new error();
  }

  async remove(id: string) {
    const existingCategory = await this.prisma
      .$queryRaw<Category>`SELECT * FROM "Category" WHERE "id" = ${id}`;
    if (!existingCategory[0]) {
      throw new NotFoundException('Not found');
    }
    const res = await this.prisma
      .$executeRaw<Category>`DELETE FROM "Category" WHERE "id" = ${id}`;
    if (res === 1) {
      return 'Successfully deleted';
    }
    throw new Error();
  }
}
