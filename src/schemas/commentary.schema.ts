import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Commentary {
  @Prop()
  idUser: string;

  @Prop()
  idRecipe: string;

  @Prop()
  note: number;

  @Prop()
  text: string;

  @Prop()
  username: string;

  @Prop()
  isVisible: boolean;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}
export const CommentarySchema = SchemaFactory.createForClass(Commentary);
