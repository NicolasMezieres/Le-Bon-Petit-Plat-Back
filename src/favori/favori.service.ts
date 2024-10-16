import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Commentary } from 'src/schemas/commentary.schema';
import { Favori } from 'src/schemas/favori.schema';
import { favoriDTO } from './dto/favori.dto';
import { userJWT } from 'utils/type';
import { User } from '@prisma/client';
import { pagination } from 'utils/pagination';

@Injectable()
export class FavoriService {
  constructor(@InjectModel('Favori') private favoriModel: Model<Favori>) {}

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
  async findAll(user: User, query: any) {
    const skip = pagination(query.page, 12);
    return await this.favoriModel
      .find({ idUser: user.id })
      .skip(skip)
      .limit(12)
      .exec();
  }
}
