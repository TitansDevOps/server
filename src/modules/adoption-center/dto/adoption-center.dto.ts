import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import { BaseDto } from '@modules/common/dto/base.dto';

export class AdoptionCenterDto extends BaseDto<AdoptionCenter> {
  constructor(entity: AdoptionCenter) {
    super(entity);
  }

  toList(): Partial<AdoptionCenter> {
    return {
      id: this.entity.id,
      name: this.entity.name,
      description: this.entity.description,
      active: this.entity.active,
      address: this.entity.address,
      phone: this.entity.phone,
      email: this.entity.email,
    };
  }

  toJson(): Partial<AdoptionCenter> & { files?: any[] } {
    return {
      id: this.entity.id,
      name: this.entity.name,
      description: this.entity.description,
      active: this.entity.active,
      address: this.entity.address,
      phone: this.entity.phone,
      email: this.entity.email,
      website: this.entity.website,
      facebook: this.entity.facebook,
      instagram: this.entity.instagram,
      twitter: this.entity.twitter,
      youtube: this.entity.youtube,
      whatsapp: this.entity.whatsapp,
    };
  }
}
