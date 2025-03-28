import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFilesByEntityDto {
  @IsString()
  @IsNotEmpty()
  entity: string;

  @IsArray()
  @IsNotEmpty()
  idEntities: Array<IdEntity>;
}

class IdEntity {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  idEntity: number;
}
