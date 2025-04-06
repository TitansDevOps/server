import { Attribute } from '../entities/attribute.entity';
import { BaseDto } from '@modules/common/dto/base.dto';

export class AttributeDto extends BaseDto<Attribute> {
  toJson(): Partial<Attribute> {
    return {
      id: this.entity.id,
      name: this.entity.name,
      allowedValues: this.entity.allowedValues,
    };
  }

  toList(): Partial<Attribute> {
    return this.toJson();
  }
}
