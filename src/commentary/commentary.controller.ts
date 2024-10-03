import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { createCommentaryDTO } from './dto';

@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Post()
  create(@Body() dto: createCommentaryDTO) {
    return this.commentaryService.create(dto);
  }

  @Get()
  findAll() {
    return this.commentaryService.findAll();
  }
}
