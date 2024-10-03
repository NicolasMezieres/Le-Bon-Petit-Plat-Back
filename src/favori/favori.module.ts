import { Module } from '@nestjs/common';
import { FavoriService } from './favori.service';
import { FavoriController } from './favori.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriSchema } from 'src/schemas/favori.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Favori', schema: FavoriSchema }]),
  ],
  controllers: [FavoriController],
  providers: [FavoriService],
})
export class FavoriModule {}
