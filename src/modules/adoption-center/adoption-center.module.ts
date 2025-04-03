import { Module } from '@nestjs/common';
import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import { FileModule } from '@modules/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionCenterController } from '@modules/adoption-center/adoption-center.controller';
import { AdoptionCenterService } from '@modules/adoption-center/adoption-center.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionCenter]), FileModule],
  controllers: [AdoptionCenterController],
  providers: [AdoptionCenterService],
})
export class AdoptioncenterModule {}
