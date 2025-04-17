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
import { AdoptionCenterService } from './adoption-center.service';
import { BaseEntityController } from '@modules/common/base/base-entity.controller';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { Role } from '@modules/common/enums/rol.enum';
import { messages } from 'src/messages/messages';
import { PaginationQueryDto } from '@modules/common/dto/pagination/pagination-query.dto';

@Controller('adoption-centers')
export class AdoptionCenterController extends BaseEntityController {
  protected service = this.adoptionCenterService;
  protected entityNotFound: string = messages.adoptionCenterNotFound;
  protected createdMessage: string = messages.adoptionCenterCreated;
  protected updatedMessage: string = messages.adoptionCenterUpdated;
  protected deletedMessage: string = messages.adoptionCenterDeleted;
  protected resourceName: string = 'adoption center';

  constructor(private readonly adoptionCenterService: AdoptionCenterService) {
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
    return super.create(createDto, res);
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
    try {
      const parsedId = parseInt(id, 10);
      await this.service.validateRemove(parsedId);
      return super.remove(id, res);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
