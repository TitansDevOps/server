import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFileEntityDto {
  @IsString()
  @IsNotEmpty()
  typeEntity: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  entityOwnerId: number;
}
