import { Controller, Get, Post } from '@nestjs/common';
import { FavoriService } from './favori.service';
import { createFavoriDTO } from './dto/create.favori.dto';

@Controller('favori')
export class FavoriController {
  constructor(private readonly favoriService: FavoriService) {}

  @Post()
  create(dto: createFavoriDTO) {
    return this.favoriService.create(dto);
  }

  @Get()
  findAll() {
    return this.favoriService.findAll();
  }
}
