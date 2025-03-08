import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { Role } from '@modules/common/enums/rol.enum';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/users.service';
import { BaseController } from '@modules/admin/admin.controller';
import { messages } from 'src/messages/messages';

@Controller('users')
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Auth(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth(Role.ADMIN)
  @Get('getallusers')
  findAll() {
    return this.usersService.findAll();
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any, res: Response) {
    try {
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        throw new BadRequestException(messages.errorUpdateUser);
      }
      updateUserDto.id = parsedId;
      return this.usersService.update(updateUserDto);
    } catch (error) {
      return this.badRequestResponse(res, messages.errorUpdateUser);
    }
  }
}
