import { Module } from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CommentaryController } from './commentary.controller';
import { Commentary, CommentarySchema } from 'src/schemas/commentary.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Commentary', schema: CommentarySchema },
    ]),
  ],
  controllers: [CommentaryController],
  providers: [CommentaryService],
})
export class CommentaryModule {}
