import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ActiveUser } from '@modules/common/decorators/active-user.decorator';
import { UserActiveInterface } from '@modules/common/interfaces/user-active.interface';
import { Role } from '@modules/common/enums/rol.enum';
import { AuthService } from '@modules/auth/auth.service';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { BaseController } from '@modules/admin/admin.controller';
import { Public } from '@modules/auth/decorators/public.decorator';

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { messages } from 'src/messages/messages';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const validationErrors = await validate(
        plainToClass(RegisterDto, registerDto),
      );
      if (validationErrors.length > 0) {
        const error = validationErrors
          .map((error) => Object.values(error.constraints).join(', '))
          .join(', ');
        this.badRequestResponse(res, error);
      }

      const response = await this.authService.register(registerDto);
      return this.createdResponse(res, messages.userCreated, response);
    } catch (error) {
      this.badRequestResponse(res, error.message);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const validationErrors = await validate(plainToClass(LoginDto, loginDto));
      if (validationErrors.length > 0) {
        throw new BadRequestException(
          validationErrors
            .map((error) => Object.values(error.constraints).join(', '))
            .join(', '),
        );
      }

      const response = await this.authService.login(loginDto);
      return this.successResponse(res, messages.successLogin, response);
    } catch (error) {
      this.badRequestResponse(res, error.message);
    }
  }

  @Get('profile')
  async profile(@ActiveUser() user: UserActiveInterface, @Res() res: Response) {
    try {
      const response = await this.authService.profile(user);
      return this.successResponse(res, messages.success, response);
    } catch (error) {
      this.badRequestResponse(res, error.message, error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
