import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FavoriService } from './favori.service';
import { favoriDTO } from './dto/favori.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { userJWT } from 'utils/type';

@UseGuards(JwtGuard)
@Controller('favori')
export class FavoriController {
  constructor(private readonly favoriService: FavoriService) {}

  @Post()
  toggleFavori(@Body() dto: favoriDTO, @GetUser() user: userJWT) {
    return this.favoriService.toggleFavori(dto, user);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() page: number ) {
    return this.favoriService.findAll(user, page);
  }
}
