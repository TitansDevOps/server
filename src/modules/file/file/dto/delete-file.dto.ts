import { IsNumber, IsNotEmpty, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteFileDto {
  @IsArray()
  @IsNotEmpty()
  file: Array<File>;
}

class File {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  id: number;
}
