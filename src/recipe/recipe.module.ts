import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentarySchema } from 'src/schemas/commentary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Commentary', schema: CommentarySchema },
    ]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
