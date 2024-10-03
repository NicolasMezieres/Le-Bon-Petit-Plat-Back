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
  isVisible: boolean;
}
export const CommentarySchema = SchemaFactory.createForClass(Commentary);
