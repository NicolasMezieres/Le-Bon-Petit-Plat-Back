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
import { isNextPage, pagination } from 'utils/pagination';

@Injectable()
export class RecipeService {
  constructor(
    private prisma: PrismaService,
    @InjectModel('Commentary') private commentaryModel: Model<Commentary>,
  ) {}
  async findAll(query: any) {
    const take = 12;
    const skip = pagination(query.page, take);
    const allRecypes = await this.prisma.recipe.findMany({
      skip: skip,
      take: take,
      where: {
        isVisible: true,
      },
    });
    const countRecypes = await this.prisma.recipe.count({
      where: {
        isVisible: true,
      },
    });
    const nextPage = isNextPage(query.page, countRecypes, take);
    return { data: allRecypes, total: countRecypes, isNextPage: nextPage };
  }
  async findByUser(user: User, query: { page: number }) {
    const take = 12;
    const skip = pagination(query.page, take);
    const myRecipes = await this.prisma.recipe.findMany({
      skip: skip,
      take: take,
      where: {
        AND: [{ isVisible: true }, { idUser: user.id }],
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const countRecype = await this.prisma.recipe.count({
      where: {
        AND: [{ isVisible: true }, { idUser: user.id }],
      },
    });
    const nextPage = isNextPage(query.page, countRecype, take);
    return { data: myRecipes, total: countRecype, isNextPage: nextPage };
  }
  async searchMyRecipes(user: User, query: searchDTO) {
    const take = 12;
    const skip = pagination(query.page, take);
    const search = query.search.split('_');
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: query.nameCategory,
      },
    });
    const myRecipes = await this.prisma.recipe.findMany({
      skip: skip,
      take: take,
      where: {
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
          { isVisible: true },
          { idUser: user.id },
          {
            AND: [
              {
                OR: [
                  ...search.map((Element) => ({
                    title: { contains: Element },
                  })),
                  ...search.map((Element) => ({
                    ingredient: {
                      some: { ingredient: { contains: Element } },
                    },
                  })),
                ],
              },
            ],
          },
          {
            OR: [
              {
                idCategory: {
                  contains: existingCategory ? existingCategory.id : '',
                },
              },
            ],
          },
        ],
      },
      include: {
        ingredient: true,
      },
    });
    const countRecype = await this.prisma.recipe.count({
      where: {
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
          { isVisible: true },
          { idUser: user.id },
          {
            AND: [
              {
                OR: [
                  ...search.map((Element) => ({
                    title: { contains: Element },
                  })),
                  ...search.map((Element) => ({
                    ingredient: {
                      some: { ingredient: { contains: Element } },
                    },
                  })),
                ],
              },
            ],
          },
          {
            OR: [
              {
                idCategory: {
                  contains: existingCategory ? existingCategory.id : '',
                },
              },
            ],
          },
        ],
      },
    });
    const nextPage = isNextPage(query.page, countRecype, take);
    return { data: myRecipes, total: countRecype, isNextPage: nextPage };
  }
  async bestRated() {
    return {
      data: await this.prisma.recipe.findMany({
        orderBy: {
          note: 'desc',
        },
        take: 6,
      }),
    };
  }
  async mostRecent() {
    return {
      data: await this.prisma.recipe.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
        take: 6,
      }),
    };
  }
  async search(query: searchDTO) {
    const take = 12;
    const skip = pagination(query.page, take);
    const search = query.search.split('_');
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: query.nameCategory,
      },
    });
    return {
      data: await this.prisma.recipe.findMany({
        skip: skip,
        take: take,
        where: {
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
            { isVisible: true },
            {
              AND: [
                {
                  OR: [
                    ...search.map((Element) => ({
                      title: { contains: Element },
                    })),
                    ...search.map((Element) => ({
                      ingredient: {
                        some: { ingredient: { contains: Element } },
                      },
                    })),
                  ],
                },
              ],
            },
            {
              OR: [
                {
                  idCategory: {
                    contains: existingCategory ? existingCategory.id : '',
                  },
                },
              ],
            },
          ],
        },
        include: {
          ingredient: true,
        },
      }),
    };
  }

  async findById(id: string) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id: id,
      },
      include: {
        ingredient: true,
      },
    });
    if (!existingRecipe) {
      throw new NotFoundException('Recette introuvable');
    }
    const existingCommentary = await this.commentaryModel.find(
      {
        idRecipe: existingRecipe.id,
      },
      [],
      { sort: { createdAt: -1 } },
    );
    return { data: existingRecipe, commentary: existingCommentary };
  }

  async create(user: User, dto: createRecipeDTO) {
    const pathPicture = './uploads/' + dto.picture;
    try {
      fs.readFileSync(pathPicture);
    } catch (error) {
      if (error) {
        throw new NotFoundException('Not found picture');
      }
    }
    const existingTitle = await this.prisma.recipe.findUnique({
      where: {
        title: dto.title,
      },
    });
    if (existingTitle) {
      fs.rmSync(pathPicture);
      throw new ForbiddenException('Title already taken');
    }
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: dto.nameCategory,
      },
    });
    if (!existingCategory) {
      fs.rmSync(pathPicture);
      throw new NotFoundException('Category not found');
    }
    const recipe = await this.prisma.recipe.create({
      data: {
        idUser: user.id,
        title: dto.title,
        picture: dto.picture,
        idCategory: existingCategory.id,
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
    return { message: 'Recette créée' };
  }

  async update(id: string, dto: updateRecipeDTO, user: userJWT) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingRecipe) {
      throw new NotFoundException('Recette introuvable');
    } else if (
      existingRecipe.idUser !== user.id &&
      user.role.name !== Role.ADMIN
    ) {
      throw new UnauthorizedException('Vous nêtes pas autorisé');
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

    const oldPathPicture = './uploads/' + existingRecipe.picture;
    const newPathPicture = './uploads/' + dto.picture;
    try {
      fs.readFileSync(oldPathPicture);
      fs.readFileSync(newPathPicture);
    } catch (error) {
      return error;
    }
    if (dto.nameCategory) {
      const existingCategory = await this.prisma.category.findUnique({
        where: {
          name: dto.nameCategory,
        },
      });
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }
    }
    await this.prisma.recipe.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
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
    console.log(existingRecipe);
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
    const pathPicture = './uploads/' + existingRecipe.picture;
    console.log(pathPicture);
    await this.prisma.recipe.delete({
      where: {
        id: id,
      },
    });
    fs.unlink(pathPicture, (err) => {
      if (err) {
        console.log(err);
        throw new NotFoundException('Not found picture');
      }
      return `Deleted picture`;
    });
    return 'Successfully deleted';
  }
}
