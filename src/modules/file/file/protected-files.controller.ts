import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('private-files')
export class ProtectedFileController {
  @UseGuards(AuthGuard)
  @Get('*')
  async serveFile(@Param() params: any, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/private/', params[0]);
    if (!existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    return res.sendFile(filePath);
  }

  @UseGuards(AuthGuard)
  @Get('*')
  async downloadFile(@Param() params: any, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/private/', params[0]);
    if (!existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    return res.download(filePath);
  }
}
