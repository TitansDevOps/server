import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { messages } from 'src/messages/messages';

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsString({ message: messages.fullNameString })
  @IsNotEmpty({ message: messages.fullNameRequired })
  @MinLength(1, { message: messages.fullNameMinLength })
  fullName: string;

  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: messages.invalidEmail })
  @IsNotEmpty({ message: messages.emailRequired })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: messages.passwordString })
  @IsNotEmpty({ message: messages.passwordRequired })
  @MinLength(6, { message: messages.passwordMinLength })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: messages.passwordPattern,
  })
  password: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: messages.phoneString })
  @IsNotEmpty({ message: messages.phoneRequired })
  phone: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: messages.addressString })
  @IsNotEmpty({ message: messages.addressRequired })
  address: string;
}
