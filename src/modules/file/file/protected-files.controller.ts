import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

import { BaseController } from '@modules/admin/admin.controller';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { messages } from 'src/messages/messages';

@Controller('private-files')
export class ProtectedFileController extends BaseController {
  @UseGuards(AuthGuard)
  @Get('*')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    try {
      const fileName = req.path.replace('/private-files/', '');
      if (!fileName) {
        return this.badRequestResponse(res, messages.errorFileNotFound);
      }

      const filePath = join(process.cwd(), 'uploads/private', fileName);

      if (!existsSync(filePath)) {
        return this.badRequestResponse(res, messages.errorFileNotFound);
      }

      return res.sendFile(filePath);
    } catch (error) {
      return this.badRequestResponse(
        res,
        error?.message || messages.error,
        error,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('download/*')
  async downloadFile(@Req() req: Request, @Res() res: Response) {
    try {
      const fileName = req.path.replace('/private-files/', '');
      if (!fileName) {
        return res.status(400).send(messages.errorGettingFilePath);
      }

      const filePath = join(process.cwd(), 'uploads/private', fileName);

      if (!existsSync(filePath)) {
        return res.status(404).send(messages.errorFileNotFound);
      }

      return res.download(filePath);
    } catch (error) {
      return this.badRequestResponse(
        res,
        error?.message || messages.error,
        error,
      );
    }
  }
}
