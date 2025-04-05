import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { Public } from '@modules/auth/decorators/public.decorator';
import { BaseController } from '@modules/common/base/admin.controller';
import { messages } from 'src/messages/messages';

@Controller('public-files')
export class PublicFileController extends BaseController {
  @Public()
  @Get('*')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    try {
      const fileName = req.path.replace('/public-files/', '');
      if (!fileName) {
        return this.badRequestResponse(res, messages.errorFileNotFound);
      }

      const filePath = join(process.cwd(), 'uploads/public', fileName);

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

  @Public()
  @Get('download/*')
  async downloadFile(@Req() req: Request, @Res() res: Response) {
    try {
      const fileName = req.path.replace('/public-files//', '');
      if (!fileName) {
        return res.status(400).send(messages.errorGettingFilePath);
      }

      const filePath = join(process.cwd(), 'uploads/public', fileName);

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
