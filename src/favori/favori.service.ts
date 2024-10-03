import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Commentary } from 'src/schemas/commentary.schema';
import { Favori } from 'src/schemas/favori.schema';
import { createFavoriDTO } from './dto/create.favori.dto';

@Injectable()
export class FavoriService {
  constructor(
    @InjectModel('Favori') private favoriModel: Model<Favori>,
    // @InjectConnection('LeBonPetitPlat') private connection: Connection,
  ) {}

  async create(dto: createFavoriDTO): Promise<Favori> {
    const newCommentary = new this.favoriModel(dto);
    return newCommentary.save();
  }
  async findAll() {
    return await this.favoriModel.find().exec();
  }
}
