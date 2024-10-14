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
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { updateByAdminDTO, updateUserDTO } from './dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Get()
  findAll(@Query() query: number) {
    return this.userService.findAll(query);
  }
  @Patch('/update')
  update(@Body() dto: updateUserDTO, @GetUser() user: User) {
    return this.userService.update(dto, user);
  }
  @UseGuards(AdminGuard)
  @Patch('/update/:id')
  updateByAdmin(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: updateByAdminDTO,
  ) {
    return this.userService.updateByAdmin(user, id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
