import { AuthGuard } from '@modules/auth/guard/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { messages } from 'src/messages/messages';

import { Role } from '../common/enums/rol.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Public } from '@modules/auth/decorators/public.decorator';
import { BaseController } from '@modules/admin/admin.controller';

import { PetsDto } from '@modules/pets/dto/pets.dto';
import { PetsService } from '@modules/pets/pets.service';

@Controller('pets')
@UseGuards(AuthGuard, RolesGuard)
export class PetsController extends BaseController {
  constructor(private readonly petsService: PetsService) {
    super();
  }

  @Public()
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const response = await this.petsService.findAll();
      return this.successResponse(res, messages.success, response);
    } catch (error) {
      return this.badRequestResponse(res, error?.message, error?.response);
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const response = await this.petsService.findOne(+id);
      return this.successResponse(res, messages.success, response.toJSON());
    } catch (error) {
      this.badRequestResponse(res, error?.message, error?.response);
    }
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('create')
  async create(@Body() petsDto: PetsDto, @Res() res: Response) {
    try {
      const response = await this.petsService.create(petsDto);
      return this.successResponse(res, messages.petCreated, response.toJSON());
    } catch (error) {
      this.badRequestResponse(res, messages.error, error.message);
    }
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('update')
  async update(@Body() petsDto: PetsDto, @Res() res: Response) {
    try {
      const response = await this.petsService.update(petsDto);
      return this.createdResponse(res, messages.petUpdated, response.toJSON());
    } catch (error) {
      return this.badRequestResponse(res, error?.message, error?.response);
    }
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      const response = await this.petsService.remove(+id);
      return this.successResponse(res, messages.petDeleted, response);
    } catch (error) {
      return this.badRequestResponse(res, error?.message, error?.response);
    }
  }
}
