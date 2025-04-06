import { Public } from '@modules/auth/decorators/public.decorator';
import { Controller, Get, Res } from '@nestjs/common';
import { BaseController } from '../common/base/admin.controller';
import { Response } from 'express';

@Controller()
export class AppController extends BaseController {
  @Public()
  @Get('/')
  getRoot(@Res() res: Response) {
    return this.successResponse(res, 'Server is running!', null);
  }
}
