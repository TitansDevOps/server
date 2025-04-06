import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdoptionCenterModule } from '@modules/adoption-center/adoption-center.module';
import { Attribute } from '@modules/petTypes/entities/attribute.entity';
import { PetTypeController } from '@modules/petTypes/pet-type.controller';
import { AttributeService } from '@modules/petTypes/attribute.service';
import { PetTypeService } from '@modules/petTypes/pet-type.service';
import { PetType } from '@modules/petTypes/entities/pet-type.entity';
import { PetAttributeValue } from '@modules/petTypes/entities/pet-attribute-value.entity';
import { PetAttributeValueService } from '@modules/petTypes/pet-attribute-value.service';
import { AttributeController } from '@modules/petTypes/attribute.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PetType, Attribute, PetAttributeValue]),
    AdoptionCenterModule,
  ],
  controllers: [PetTypeController, AttributeController],
  providers: [PetTypeService, AttributeService, PetAttributeValueService],
  exports: [PetTypeService, AttributeService, PetAttributeValueService],
})
export class PetTypesModule {}
