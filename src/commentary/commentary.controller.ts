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
import { CommentaryService } from './commentary.service';
import { createCommentaryDTO, updateCommentaryDTO } from './dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { userJWT } from 'utils/type';

@UseGuards(JwtGuard)
@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Post()
  create(@Body() dto: createCommentaryDTO, @GetUser() user: User) {
    return this.commentaryService.create(dto, user);
  }

  @Get('/myCommentaries')
  findAllMyCommentaries(@GetUser() user: userJWT) {
    return this.commentaryService.findAllMyCommentaries(user);
  }

  @Get('/recipe/:id')
  findAllByRecipe(@Param('id') id: string) {
    return this.commentaryService.findAllByRecipe(id);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @GetUser() user: userJWT,
    @Body() dto: updateCommentaryDTO,
  ) {
    return this.commentaryService.update(id, user, dto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string, @GetUser() user: userJWT) {
    return this.commentaryService.remove(id, user);
  }
}
