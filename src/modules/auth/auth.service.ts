import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';


import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { UsersService } from '@modules/users/users.service';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { LoginDto } from '@modules/auth/dto/login.dto';

import { messages } from 'src/messages/messages';
import { Role } from '@modules/common/enums/rol.enum';

/**
 * Auth service class: allow register and authenticate users at the system 
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    fullName,
    email,
    password,
    createdAt,
    address,
    phone,
  }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException(messages.userAlreadyExist);
    }

    const oUser = await this.usersService.create({
      fullName,
      email,
      password: await bcryptjs.hash(password, 10),
      createdAt: createdAt,
      address: address,
      phone: phone,
      role: Role.USER,
    });

    return oUser;
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException(messages.emailIsWrong);
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(messages.passwordIsWrong);
    }

    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user,
    };
  }

  async profile({ email }: { email: string }) {
    return await this.usersService.findOneByEmail(email);
  }
}
