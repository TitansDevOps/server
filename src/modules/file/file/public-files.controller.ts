import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { Public } from '@modules/auth/decorators/public.decorator';
import { BaseController } from '@modules/admin/admin.controller';

import { messages } from 'src/messages/messages';

@Controller('public-files')
export class PublicFileController extends BaseController {
  @Public()
  @Get('*')
  async serveFile(@Param() params: any, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/public/', params[0]);
    if (!existsSync(filePath)) {
      this.badRequestResponse(res, messages.errorFileNotFound);
    }
    return res.sendFile(filePath);
  }

  @Public()
  @Get('*')
  async downloadFile(@Param() params: any, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/public/', params[0]);
    if (!existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    return res.download(filePath);
  }
}
