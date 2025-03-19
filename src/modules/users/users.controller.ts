import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
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
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return this.successResponse(res, messages.success, users);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.usersService.findOne(+id);
      return this.successResponse(res, messages.success, response);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @Res() res: Response,
  ) {
    try {
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        throw new BadRequestException(messages.errorUpdateUser);
      }
      updateUserDto.id = parsedId;
      const updatedUser = await this.usersService.update(updateUserDto);
      return this.successResponse(res, messages.updateUser, updatedUser);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
