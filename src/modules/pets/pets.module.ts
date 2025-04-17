import { forwardRef, Module } from '@nestjs/common';
import { FileModule } from '@modules/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdoptionCenterModule } from '@modules/adoption-center/adoption-center.module';
import { Pets } from '@modules/pets/entities/pets.entity';
import { PetsController } from '@modules/pets/pets.controller';
import { PetsService } from '@modules/pets/pets.service';
import { PetTypesModule } from '@modules/petTypes/pet-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pets]),
    FileModule,
    forwardRef(() => AdoptionCenterModule),
    forwardRef(() => PetTypesModule),
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
