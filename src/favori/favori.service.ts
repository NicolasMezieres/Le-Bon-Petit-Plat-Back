import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Commentary } from 'src/schemas/commentary.schema';
import { Favori } from 'src/schemas/favori.schema';
import { favoriDTO } from './dto/favori.dto';
import { userJWT } from 'utils/type';
import { User } from '@prisma/client';
import { pagination } from 'utils/pagination';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriService {
  constructor(
    @InjectModel('Favori') private favoriModel: Model<Favori>,
    private prisma: PrismaService,
  ) {}

  async toggleFavori(dto: favoriDTO, user: userJWT) {
    const existingFavori = await this.favoriModel
      .find({ idRecipe: dto.idRecipe, idUser: user.id })
      .exec();
    if (!existingFavori[0]) {
      await this.favoriModel.create({
        idUser: user.id,
        idRecipe: dto.idRecipe,
      });
      return 'Successfuly add';
    } else {
      await this.favoriModel.findByIdAndDelete(existingFavori[0].id);
      return 'Successfuly removed';
    }
  }
  //todo faire la recherche de favoris dans le find all
  async findAll(user: User, query: any) {
    const take = 12;
    const skip = pagination(query.page, take);
    const existingFavoris = await this.favoriModel
      .find({ idUser: user.id })
      .exec();

    const search = query.search.split('_');

    console.log(search, 'ici');
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        name: query.nameCategory ? query.nameCategory : '',
      },
    });
    console.log(existingCategory);
    const existingRecipe = await this.prisma.recipe.findMany({
      skip: skip,
      take: take,
      where: {
        OR: [...existingFavoris.map((Element) => ({ id: Element.idRecipe }))],
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
    });
    return { data: existingRecipe };
  }
  async isFavoriteRecipe(user: User, id: string) {
    const isFavorite = await this.favoriModel.find({
      $and: [{ idUser: user.id }, { idRecipe: id }],
    });
    if (isFavorite && isFavorite.length > 0) {
      return true;
    }
    return false;
  }
}
