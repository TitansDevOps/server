import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFilesByEntityDto {
  @IsString()
  @IsNotEmpty()
  entity: string;

  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => Number(v)) : [],
  )
  idEntities: number[];
}
