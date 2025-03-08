import { IsString, IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  recipient: string | string[];

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
