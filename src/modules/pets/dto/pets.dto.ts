import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { messages } from 'src/messages/messages';
import { AdoptionCenterPetDto } from '@modules/adoption-center/dto/adoption-center-pet.dto';
import { Pets } from '@modules/pets/entities/pets.entity';

export class PetsDto {
  @IsOptional()
  @IsNumber()
  id: number | null;

  @IsNotEmpty({ message: messages.propertyNameRequired })
  @IsString()
  name: string;

  @IsNotEmpty({ message: messages.propertyDescriptionRequired })
  @IsString()
  description: string;

  @IsOptional()
  active: boolean;

  @IsNotEmpty()
  @Type(() => AdoptionCenterPetDto)
  adoptionCenter: AdoptionCenterPetDto;

  @IsOptional()
  files: any[] | [];

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      active: this.active,
      adoptionCenter: this.adoptionCenter.toJSON(),
      files: Array.isArray(this.files)
        ? this.files.filter((file) => file != null)
        : [],
    };
  }

  public fromModel(model: Pets): PetsDto {
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
    this.active = model.active;
    this.adoptionCenter = new AdoptionCenterPetDto().fromModel(
      model.adoptionCenter,
    );
    return this;
  }
}
