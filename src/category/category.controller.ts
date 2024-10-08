import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDTO, updateCategoryDTO } from './dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: createCategoryDTO) {
    return this.categoryService.create(dto);
  }
  @UseGuards(AdminGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() dto: updateCategoryDTO) {
    return this.categoryService.update(id, dto);
  }
  @UseGuards(AdminGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
