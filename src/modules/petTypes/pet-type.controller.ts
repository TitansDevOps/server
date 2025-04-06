import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { Role } from '@modules/common/enums/rol.enum';
import { Auth } from '@modules/auth/decorators/auth.decorator';

import { messages } from 'src/messages/messages';
import { BaseEntityController } from '@modules/common/base/base-entity.controller';
import { PaginationQueryDto } from '@modules/common/dto/pagination/pagination-query.dto';
import { PetTypeService } from '@modules/petTypes/pet-type.service';

@Controller('pet-types')
export class PetTypeController extends BaseEntityController {
  protected service = this.petTypeService;
  protected entityNotFound: string = messages.petTypeNotFound;
  protected entityAlreadyExists: string = messages.petTypeAlreadyExists;
  protected createdMessage: string = messages.petTypeCreated;
  protected updatedMessage: string = messages.petTypeUpdated;
  protected deletedMessage: string = messages.petTypeDeleted;
  protected resourceName: string = 'pet type';

  constructor(private readonly petTypeService: PetTypeService) {
    super();
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto, @Res() res: Response) {
    return super.findAll(query, res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return super.findOne(id, res);
  }

  @Auth(Role.ADMIN, Role.OPERATOR)
  @Post()
  async create(@Body() createDto: any, @Res() res: Response) {
    try {
      const created = await this.petTypeService.createWithAttributes(createDto);
      return this.successResponse(res, this.createdMessage, created);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Auth(Role.ADMIN, Role.OPERATOR)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Res() res: Response,
  ) {
    return super.update(id, updateDto, res);
  }

  @Auth(Role.ADMIN, Role.OPERATOR)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return super.remove(id, res);
  }
}
