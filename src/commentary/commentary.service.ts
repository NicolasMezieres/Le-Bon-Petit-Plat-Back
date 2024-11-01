import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, set } from 'mongoose';
import { createCommentaryDTO, updateCommentaryDTO } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Commentary } from 'src/schemas/commentary.schema';
import { User } from '@prisma/client';
import { userJWT } from 'utils/type';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'utils/const';

@Injectable()
export class CommentaryService {
  constructor(
    @InjectModel('Commentary') private commentaryModel: Model<Commentary>,
    private prisma: PrismaService,
  ) {}

  async create(dto: createCommentaryDTO, user: User) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id: dto.idRecipe,
      },
    });
    if (!existingRecipe) {
      throw new NotFoundException('Not found recipe');
    }
    const existingCommentary = await this.commentaryModel
      .find({
        $and: [
          { idUser: user.id },
          { idRecipe: dto.idRecipe },
          { isVisible: true },
        ],
      })
      .exec();
    if (existingCommentary[0]) {
      throw new ForbiddenException(
        'Vous avez déjà créer un commentaire sur cette recette',
      );
    }
    const data = {
      ...dto,
      idUser: user.id,
      username: user.username,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newCommentary = new this.commentaryModel(data);
    const res = await newCommentary.save();
    if (res) {
      await this.prisma.recipe.update({
        where: {
          id: dto.idRecipe,
        },
        data: {
          sumNote: existingRecipe.sumNote + res.note,
          numberNote: existingRecipe.numberNote + 1,
          note:
            (existingRecipe.sumNote + res.note) /
            (existingRecipe.numberNote + 1),
        },
      });
    }
    return { data: 'Commentary created' };
  }

  async findAllByRecipe(id: string) {
    const res = await this.commentaryModel
      .find({ $and: [{ idRecipe: id }, { isVisible: true }] })
      .exec();
    return res;
  }
  async findAllMyCommentaries(user: userJWT) {
    return await this.commentaryModel
      .find({
        $and: [{ idUser: user.id }, { isVisible: true }],
      })
      .exec();
  }

  async update(id: string, user: userJWT, dto: updateCommentaryDTO) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id: dto.idRecipe,
      },
    });
    if (!existingRecipe) {
      throw new NotFoundException('Not found recipe');
    }

    const commentary = await this.commentaryModel
      .find({
        $and: [{ _id: id }, { idRecipe: dto.idRecipe }],
      })
      .exec();

    if (
      !commentary[0] ||
      (user.role.name !== Role.ADMIN && commentary[0].isVisible === false)
    ) {
      console.log(commentary);
      throw new NotFoundException('Not found commentary');
    }
    if (user.id !== commentary[0].idUser && user.role.name !== Role.ADMIN) {
      throw new UnauthorizedException('Unauthorized');
    }
    const note = -commentary[0].note + dto.note;

    await this.commentaryModel
      .findByIdAndUpdate(id, { ...dto, updatedAt: new Date() }, { new: true })
      .exec();
    await this.prisma.recipe.update({
      where: {
        id: dto.idRecipe,
      },
      data: {
        sumNote: existingRecipe.sumNote + note,
        note: (existingRecipe.sumNote + note) / existingRecipe.numberNote,
      },
    });
    return { data: 'Successfuly updated' };
  }

  async remove(id: string, user: userJWT) {
    const commentary = await this.commentaryModel.findById(id).exec();
    if (
      !commentary ||
      (commentary.isVisible === false && user.role.name !== Role.ADMIN)
    ) {
      throw new NotFoundException('Not found Commentary');
    } else if (commentary.idUser !== user.id && user.role.name !== Role.ADMIN) {
      throw new UnauthorizedException('Unauthorized');
    }
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: commentary.idRecipe,
      },
    });
    if (!recipe) {
      throw new NotFoundException('Not found recipe');
    }

    await this.prisma.recipe.update({
      where: {
        id: commentary.idRecipe,
      },
      data: {
        numberNote: recipe.numberNote - 1,
        sumNote: { decrement: commentary.note },
        note:
          recipe.numberNote - 1 === 0
            ? 0
            : (recipe.sumNote - commentary.note) / (recipe.numberNote - 1),
      },
    });
    await this.commentaryModel.findByIdAndDelete(id).exec();
    return { data: 'Successfully deleted' };
  }
}
