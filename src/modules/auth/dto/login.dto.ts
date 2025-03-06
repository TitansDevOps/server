import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { messages } from 'src/messages/messages';

export class LoginDto {
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: messages.invalidEmail })
  @IsNotEmpty({ message: messages.emailRequired })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  password: string;
}
