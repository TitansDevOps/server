import { AuthGuard } from '@modules/auth/guard/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { AdoptionCenterService } from '@modules/adoption-center/adoption-center.service';
import { AdoptionCenterDto } from '@modules/adoption-center/dto/adoption-center.dto';

import { messages } from 'src/messages/messages';

import { Role } from '@modules/common/enums/rol.enum';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Public } from '@modules/auth/decorators/public.decorator';
import { BaseController } from '@modules/common/base/admin.controller';

@Controller('adoption-centers')
@UseGuards(AuthGuard, RolesGuard)
export class AdoptionCenterController extends BaseController {
  constructor(private readonly adoptionCenterService: AdoptionCenterService) {
    super();
  }

  @Public()
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const response = await this.adoptionCenterService.findAll();
      return this.successResponse(res, messages.success, response);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const response = await this.adoptionCenterService.findOne(+id);
      return this.successResponse(res, messages.success, response.toJSON());
    } catch (error) {
      this.badRequestResponse(
        res,
        error?.message || messages.error,
        error?.response,
      );
    }
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('create')
  async create(
    @Body() adoptionCenterDto: AdoptionCenterDto,
    @Res() res: Response,
  ) {
    try {
      const response =
        await this.adoptionCenterService.create(adoptionCenterDto);
      return this.createdResponse(
        res,
        messages.adoptionCenterCreated,
        response,
      );
    } catch (error) {
      this.badRequestResponse(res, messages.error, error.message);
    }
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('update')
  async update(
    @Body() adoptionCenterDto: AdoptionCenterDto,
    @Res() res: Response,
  ) {
    try {
      const response =
        await this.adoptionCenterService.update(adoptionCenterDto);
      return this.successResponse(
        res,
        messages.adoptionCenterUpdated,
        response,
      );
    } catch (error) {
      return this.badRequestResponse(res, error?.message, error?.response);
    }
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      const response = await this.adoptionCenterService.remove(+id);
      return this.successResponse(
        res,
        messages.adoptionCenterDeleted,
        response,
      );
    } catch (error) {
      return this.badRequestResponse(res, error?.message, error?.response);
    }
  }
}
