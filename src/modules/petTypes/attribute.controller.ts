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
import { messages } from 'src/messages/messages';
import { Role } from '@modules/common/enums/rol.enum';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { BaseEntityController } from '@modules/common/base/base-entity.controller';
import { PaginationQueryDto } from '@modules/common/dto/pagination/pagination-query.dto';
import { AttributeService } from '@modules/petTypes/attribute.service';

@Controller('attributes')
export class AttributeController extends BaseEntityController {
  protected service = this.attributeService;
  protected entityNotFound: string = messages.attributePetNotFound;
  protected entityAlreadyExists: string = messages.attributeAlreadyExists;
  protected createdMessage: string = messages.attributeCreated;
  protected updatedMessage: string = messages.attributeUpdated;
  protected deletedMessage: string = messages.attributeDeleted;
  protected resourceName: string = 'attribute';

  constructor(private readonly attributeService: AttributeService) {
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

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() createDto: any, @Res() res: Response) {
    return super.create(createDto, res);
  }

  @Auth(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Res() res: Response,
  ) {
    return super.update(id, updateDto, res);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return super.remove(id, res);
  }
}
