import { Pets } from '@modules/pets/entities/pets.entity';
import { BaseDto } from '@modules/common/dto/base.dto';
import { AdoptionCenterDto } from '@modules/adoption-center/dto/adoption-center.dto';
import { PetTypeDto } from '@modules/petTypes/dto/pet-type.dto';
import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import { PetType } from '@modules/petTypes/entities/pet-type.entity';

export class PetsDto extends BaseDto<Pets> {
  files: any[] = [];
  attributeValues: any[] = [];

  constructor(entity: Pets) {
    super(entity);
  }

  toJson(): Partial<Pets> {
    const { id, name, description, active, adoptionCenter, petType } =
      this.entity;

    const basePet: Partial<Pets> = {
      id,
      name,
      description,
      active,
      adoptionCenter: adoptionCenter
        ? (new AdoptionCenterDto(adoptionCenter).toJson() as AdoptionCenter)
        : undefined,
      petType: petType
        ? (new PetTypeDto(petType).toJson() as PetType)
        : undefined,
    };

    return {
      ...basePet,
      attributeValues: this.entity.attributeValues?.map((av) => ({
        id: av.id,
        value: av.value,
        attribute: {
          id: av.attribute.id,
          name: av.attribute.name,
          allowedValues: av.attribute.allowedValues,
        },
      })),
      files: this.files.filter((file) => file != null),
    } as any;
  }

  toList(): Partial<Pets> {
    const { id, name, description, active } = this.entity;

    return {
      id,
      name,
      description,
      active,
      files: this.files.filter((file) => file != null),
    } as any;
  }
}
