import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { Role } from '@modules/common/enums/rol.enum';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserService } from '@modules/users/users.service';
import { BaseEntityController } from '@modules/common/base/base-entity.controller';
import { PaginationQueryDto } from '@modules/common/dto/pagination/pagination-query.dto';
import { messages } from 'src/messages/messages';

@Controller('users')
export class UsersController extends BaseEntityController {
  protected service = this.usersService;
  protected entityNotFound: string = messages.userNotFound;
  protected entityAlreadyExists: string = messages.userAlreadyExist;
  protected createdMessage: string = messages.userCreated;
  protected updatedMessage: string = messages.userUpdated;
  protected deletedMessage: string = messages.userDeleted;
  protected resourceName: string = messages.user;

  constructor(private readonly usersService: UserService) {
    super();
  }

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return super.create(createUserDto, res);
  }

  @Auth(Role.ADMIN)
  @Get()
  async getAll(@Query() query: PaginationQueryDto, @Res() res: Response) {
    return this.findAll(query, res);
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    return this.findOne(id, res);
  }

  @Auth(Role.ADMIN, Role.OPERATOR, Role.USER)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @Res() res: Response,
  ) {
    return super.update(id, updateUserDto, res);
  }
}
