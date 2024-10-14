import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { createRecipeDTO, updateRecipeDTO } from './dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { userJWT } from 'utils/type';
import { searchDTO } from './dto/search.recipe.dto';

@UseGuards(JwtGuard)
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  findAll(@Query() page: string) {
    return this.recipeService.findAll(page);
  }
  @Get('/user')
  findByUser(@GetUser() user: User, @Query() page: number) {
    return this.recipeService.findByUser(user, page);
  }
  @Get('/bestRated')
  bestRated() {
    return this.recipeService.bestRated();
  }
  @Get('/mostRecent')
  mostRecent() {
    return this.recipeService.mostRecent();
  }
  @Get('/search')
  search(@Query() query: searchDTO) {
    return this.recipeService.search(query);
  }
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.recipeService.findById(id);
  }

  @Post()
  create(@GetUser() user: User, @Body() dto: createRecipeDTO) {
    return this.recipeService.create(user, dto);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() dto: updateRecipeDTO,
    @GetUser() user: userJWT,
  ) {
    return this.recipeService.update(id, dto, user);
  }

  @Delete('/:id')
  remove(@Param('id') id: string, @GetUser() user: userJWT) {
    return this.recipeService.remove(id, user);
  }
}
