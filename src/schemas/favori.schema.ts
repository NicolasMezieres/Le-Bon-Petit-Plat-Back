import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Favori {
  @Prop()
  idUser: string;

  @Prop()
  idRecipe: string;
}
export const FavoriSchema = SchemaFactory.createForClass(Favori);
