import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FileDto {
  @IsString()
  name: string;

  @IsString()
  base64: string;
}

export class CreateFileEntityBase64Dto {
  @IsNumber()
  entityOwnerId: number;

  @IsString()
  typeEntity: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files: FileDto[];
}
