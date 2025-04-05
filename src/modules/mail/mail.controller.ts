import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { BaseController } from '@modules/common/base/admin.controller';

import { MailService } from '@modules/mail/mail.service';
import { SendMailDto } from '@modules/mail/dto/send-mail.dto';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { Role } from '@modules/common/enums/rol.enum';
import { messages } from 'src/messages/messages';

@Controller('mail')
export class MailController extends BaseController {
  constructor(private readonly mailService: MailService) {
    super();
  }

  @Auth(Role.ADMIN)
  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto, @Res() res: Response) {
    try {
      const response = await this.mailService.sendMail(sendMailDto);
      this.successResponse(res, messages.mailSendSuccess, response);
    } catch (error) {
      this.badRequestResponse(res, error.message, error);
    }
  }

  @Auth(Role.ADMIN)
  @Get('logs')
  async getMailLogs(@Res() res: Response) {
    try {
      const response = await this.mailService.getMailLogs();
      this.successResponse(res, messages.success, response);
    } catch (error) {
      this.badRequestResponse(res, error.message, error);
    }
  }
}
