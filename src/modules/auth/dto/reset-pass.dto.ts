import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';
import { messages } from 'src/messages/messages';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: messages.passwordString })
  @IsNotEmpty({ message: messages.passwordRequired })
  @MinLength(6, { message: messages.passwordMinLength })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: messages.passwordPattern,
  })
  password: string;
}
