import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { createCommentaryDTO } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Commentary } from 'src/schemas/commentary.schema';

@Injectable()
export class CommentaryService {
  constructor(
    @InjectModel('Commentary') private commentaryModel: Model<Commentary>,
    // @InjectConnection('LeBonPetitPlat') private connection: Connection,
  ) {}

  async create(dto: createCommentaryDTO): Promise<Commentary> {
    const newCommentary = new this.commentaryModel(dto);
    return newCommentary.save();
  }
  async findAll() {
    return await this.commentaryModel.find().exec();
  }
}
