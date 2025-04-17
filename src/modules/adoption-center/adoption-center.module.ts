import { Module, forwardRef } from '@nestjs/common';
import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import { FileModule } from '@modules/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionCenterController } from '@modules/adoption-center/adoption-center.controller';
import { AdoptionCenterService } from '@modules/adoption-center/adoption-center.service';
import { PetsModule } from '@modules/pets/pets.module';
import { PetTypesModule } from '@modules/petTypes/pet-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdoptionCenter]),
    FileModule,
    forwardRef(() => PetsModule),
    forwardRef(() => PetTypesModule),
  ],
  controllers: [AdoptionCenterController],
  providers: [AdoptionCenterService],
  exports: [AdoptionCenterService],
})
export class AdoptionCenterModule {}
