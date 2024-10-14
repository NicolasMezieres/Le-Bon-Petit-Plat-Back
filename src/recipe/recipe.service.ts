import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRecipeDTO, ingredient, updateRecipeDTO } from './dto';
import { userJWT } from 'utils/type';
import { Role } from 'utils/const';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commentary } from 'src/schemas/commentary.schema';
import { searchDTO } from './dto/search.recipe.dto';
import * as fs from 'fs';
import { pagination } from 'utils/pagination';
@Injectable()
export class RecipeService {
  constructor(
    private prisma: PrismaService,
    @InjectModel('Commentary') private commentaryModel: Model<Commentary>,
  ) {}
  //TODO mettre une limite offset PARTOUT (même en dehors de la ressource)
  async findAll(query: any) {
    const skip = pagination(query.page, 12);
    console.log(skip);
    const data = await this.prisma.recipe.findMany({
      skip: skip,
      take: 12,
      where: {
        isVisible: true,
      },
    });
    return { data: data, count: data.length };
  }
  async findByUser(user: User, query: any) {
    const skip = pagination(query.page, 12);
    return await this.prisma.recipe.findMany({
      skip: skip,
      take: 12,
      where: {
        AND: [{ isVisible: true }, { idUser: user.id }],
      },
    });
  }
  async bestRated() {
    return await this.prisma.recipe.findMany({
      orderBy: {
        note: 'desc',
      },
      take: 6,
    });
  }
  async mostRecent() {
    return await this.prisma.recipe.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: 6,
    });
  }
  async search(query: searchDTO) {
    const skip = pagination(query.page, 12);
    const search = query.search.split('_');
    return await this.prisma.recipe.findMany({
      skip: skip,
      take: 12,
      where: {
        idCategory: query.idCategory,

        AND: [
          {
            note: {
              gte:
                Number(query.note) === 5
                  ? 5
                  : Number(query.note) === 4
                    ? 4
                    : Number(query.note) === 3
                      ? 3
                      : Number(query.note) === 2
                        ? 2
                        : Number(query.note) === 1
                          ? 1
                          : 0,
            },
          },
          {
            note: {
              lte:
                Number(query.note) === 1
                  ? 2
                  : Number(query.note) === 2
                    ? 3
                    : Number(query.note) === 3
                      ? 4
                      : 5,
            },
          },
        ],
        OR: [
          ...search.map((Element) => ({
            title: {
              contains: Element,
            },
          })),
          {
            AND: search.map((Element) => ({
              ingredient: {
                some: { ingredient: { contains: Element } },
              },
            })),
          },
        ],
      },
      include: {
        ingredient: true,
      },
    });
  }

  async findById(id: string) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingRecipe) {
      throw new NotFoundException('Not found');
    }
    return existingRecipe;
  }

  async create(user: User, dto: createRecipeDTO) {
    const existingTitle = await this.prisma.recipe.findUnique({
      where: {
        title: dto.title,
      },
    });
    if (existingTitle) {
      throw new ForbiddenException('Title already taken');
    }
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: dto.idCategory,
      },
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }
    const pathPicture = './uploads/' + dto.picture;
    try {
      fs.readFileSync(pathPicture);
    } catch (error) {
      if (error) {
        throw new NotFoundException('Not found picture');
      }
    }
    const recipe = await this.prisma.recipe.create({
      data: {
        idUser: user.id,
        title: dto.title,
        picture: dto.picture,
        idCategory: dto.idCategory,
        piece: dto.piece,
        difficulty: dto.difficulty,
        preparationTime: dto.preparationTime,
        standingTime: dto.standingTime,
        cookingTime: dto.cookingTime,
        cookingStep: dto.cookingStep,
      },
    });
    const dataIngredient = [];
    dto.ingredient.map((ingredient) => {
      const ingredients = { ...ingredient, idRecipe: recipe.id };
      dataIngredient.push(ingredients);
    });
    await this.prisma.ingredient.createMany({
      data: dataIngredient,
    });
    return 'Recipe created';
  }

  async update(id: string, dto: updateRecipeDTO, user: userJWT) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingRecipe) {
      throw new NotFoundException('Not found recipe');
    } else if (
      existingRecipe.idUser !== user.id &&
      user.role.name !== Role.ADMIN
    ) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (dto.title) {
      const existingTitle = await this.prisma.recipe.findUnique({
        where: {
          title: dto.title,
        },
      });
      if (existingTitle && existingTitle.title !== dto.title) {
        throw new ForbiddenException('Title always taken');
      }
    }
    if (dto.idCategory) {
      const existingCategory = await this.prisma.category.findUnique({
        where: {
          id: dto.idCategory,
        },
      });
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }
    }
    const oldPathPicture = './uploads/' + existingRecipe.picture;
    const newPathPicture = './uploads/' + dto.picture;
    try {
      fs.readFileSync(oldPathPicture);
      fs.readFileSync(newPathPicture);
    } catch (error) {
      return error;
    }
    await this.prisma.recipe.update({
      where: {
        id: id,
      },
      data: {
        title: dto.title,
        picture: dto.picture,
      },
    });
    fs.unlink(oldPathPicture, (err) => {
      if (err) {
        throw new NotFoundException('Not found picture');
      }
      return `Deleted picture`;
    });
    return 'Change successed';
  }

  async remove(id: string, user: userJWT) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingRecipe) {
      throw new NotFoundException('Not found');
    }
    if (existingRecipe.idUser !== user.id && user.role.name !== Role.ADMIN) {
      throw new UnauthorizedException('You are not author of this recipe');
    }
    await this.commentaryModel.deleteMany({ idRecipe: id }).exec();
    await this.commentaryModel.deleteMany({ idRecipe: id }).exec();
    await this.prisma.ingredient.deleteMany({
      where: {
        idRecipe: id,
      },
    });
    const pathPicture = '../../uploads/' + existingRecipe.picture;
    await this.prisma.recipe.delete({
      where: {
        id: id,
      },
    });
    fs.unlink(pathPicture, (err) => {
      if (err) {
        throw new NotFoundException('Not found picture');
      }
      return `Deleted picture`;
    });
    return 'Successfully deleted';
  }
}
