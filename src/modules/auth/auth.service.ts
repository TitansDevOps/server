import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { UsersService } from '@modules/users/users.service';
import { MailService } from '@modules/mail/mail.service';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { SendMailDto } from '@modules/mail/dto/send-mail.dto';
import { ResetPasswordDto } from '@modules/auth/dto/reset-pass.dto';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

import { messages } from 'src/messages/messages';
import { Role } from '@modules/common/enums/rol.enum';
import { resetPasswordTemplate } from '@modules/mail/templates/resetPasswordTemplate';

/**
 * Auth service class: allow register and authenticate users at the system
 */
@Injectable()
export class AuthService {
  private readonly URL_CLIENT = process.env.URL_CLIENT;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register({ fullName, email, password, address, phone }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException(messages.userAlreadyExist);
    }

    const oUser = await this.usersService.create({
      fullName,
      email,
      password: await this.hashPassword(password),
      createdAt: new Date(),
      address: address,
      phone: phone,
      role: Role.USER,
    });

    const responseUser = {
      id: oUser.id,
      email: oUser.email,
      fullName: oUser.fullName,
      address: oUser.address,
      phone: oUser.phone,
      role: oUser.role,
      createdAt: oUser.createdAt,
    };

    return { user: responseUser };
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

    const responseUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      address: user.address,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };

    return {
      token,
      user: responseUser,
    };
  }

  async profile({ email }: { email: string }) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(messages.userNotFound);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      address: user.address,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive,
    };
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(messages.userNotFound);
    }

    const payload = { email: user.email };
    const resetToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });

    const resetUrl = `${this.URL_CLIENT}/reset-password?token=${resetToken}`;
    const subject = 'Restablecer contraseña';
    const htmlTemplate = resetPasswordTemplate(user.fullName, resetUrl);

    const emailDTO: SendMailDto = {
      recipient: email,
      action: 'reset-password',
      subject,
      bodyMail: htmlTemplate,
    };

    await this.mailService.sendMail(emailDTO);

    return { message: messages.resetEmailSent };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userEmail = payload.email;

      const user = await this.usersService.findOneByEmail(userEmail);

      if (!user) {
        throw new NotFoundException(messages.userNotFound);
      }

      const hashedPassword = await this.hashPassword(password);
      user.password = hashedPassword;

      const dto = new UpdateUserDto();
      const dtoUser = await dto.updateDTO(user, true);
      await this.usersService.update(dtoUser);

      return { message: messages.passwordResetSuccess };
    } catch (error) {
      throw new BadRequestException(messages.invalidEmail);
    }
  }

  async hashPassword(password: string) {
    return bcryptjs.hash(password, 10);
  }
}
