import { PetType } from '@modules/petTypes/entities/pet-type.entity';
import { BaseDto } from '@modules/common/dto/base.dto';

export class PetTypeDto extends BaseDto<PetType> {
  constructor(entity: PetType) {
    super(entity);
  }

  toJson(): Partial<PetType> & { attributes?: any[] } {
    const base = {
      id: this.entity.id,
      name: this.entity.name,
    };

    if (this.entity.attributes && this.entity.attributes.length > 0) {
      return {
        ...base,
        attributes: this.entity.attributes.map((attr) => ({
          id: attr.id,
          name: attr.name,
          allowedValues: attr.allowedValues,
        })),
      } as any;
    }

    return {
      ...base,
      attributes: '',
    } as any;
  }

  toList(): Partial<PetType> {
    return {
      id: this.entity.id,
      name: this.entity.name,
    };
  }
}
