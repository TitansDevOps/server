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
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EcommerceController } from '../admin/ecommerce.controller';
import { Public } from './decorators/public.decorator';

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { messages } from 'src/messages/messages';

@Controller('auth')
export class AuthController extends EcommerceController {
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
  @Auth(Role.ADMIN)
  async profile(@ActiveUser() user: UserActiveInterface, @Res() res: Response) {
    try {
      const response = await this.authService.profile(user);
      return this.successResponse(res, messages.success, response);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
