// category.service.ts
import {
  Injectable,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import { AdoptionCenterDto } from '@modules/adoption-center/dto/adoption-center.dto';

import { messages } from 'src/messages/messages';
import { GetFilesByEntityDto } from '@modules/file/file/dto/get-files-entity.dto';
import { FileService } from '@modules/file/file/file.service';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AdoptionCenterService {
  private readonly ADOPTION_CENTER = 'ADOPTION_CENTER';

  constructor(
    @InjectRepository(AdoptionCenter)
    private readonly adoptionCenterRepository: Repository<AdoptionCenter>,
    private readonly fileService: FileService,
  ) {}

  async findAll() {
    const adoptionCenters = await this.adoptionCenterRepository.find();

    const adoptionCentersIds = await Promise.all(
      adoptionCenters.map((adoptionCenter) => adoptionCenter.id),
    );

    const getfileDTO = new GetFilesByEntityDto();
    getfileDTO.entity = this.ADOPTION_CENTER;
    const idEntities = [];
    idEntities.push(...adoptionCentersIds);
    getfileDTO.idEntities = idEntities;

    const files = await this.fileService.getFilesByEntity(getfileDTO);

    const response = await Promise.all(
      adoptionCenters.map(async (adoptionCenter) => {
        const adoptionCenterModel = new AdoptionCenterDto().fromModel(
          adoptionCenter,
        );
        adoptionCenterModel.files = await Promise.all(
          files.map(async (file) => {
            if ((await file.getIdEntity()) === adoptionCenter.id) {
              return await file.toJson();
            }
          }),
        );
        return adoptionCenterModel.toJSON();
      }),
    );

    return response;
  }

  async findOne(id: number): Promise<AdoptionCenterDto> {
    const adoptionCenter = await this.adoptionCenterRepository.findOne({
      where: { id: id },
    });
    if (!adoptionCenter) {
      throw new NotFoundException(messages.adoptionCenterNotFound);
    }

    const getfileDTO = new GetFilesByEntityDto();
    getfileDTO.entity = this.ADOPTION_CENTER;
    getfileDTO.idEntities = [adoptionCenter.id];

    const files = await this.fileService.getFilesByEntity(getfileDTO);

    const adoptionCenterModel = new AdoptionCenterDto().fromModel(
      adoptionCenter,
    );
    adoptionCenterModel.files = await Promise.all(
      files.map(async (file) => await file.toJson()),
    );

    return adoptionCenterModel;
  }

  async create(
    createAdoptionCenter: AdoptionCenterDto,
  ): Promise<AdoptionCenter> {
    const adoptionCenter = new AdoptionCenter();
    adoptionCenter.name = createAdoptionCenter.name;
    adoptionCenter.description = createAdoptionCenter.description;
    adoptionCenter.active = true;
    adoptionCenter.address = createAdoptionCenter.address;
    adoptionCenter.phone = createAdoptionCenter.phone;
    adoptionCenter.email = createAdoptionCenter.email;
    adoptionCenter.website = createAdoptionCenter.website;
    adoptionCenter.facebook = createAdoptionCenter.facebook;
    adoptionCenter.instagram = createAdoptionCenter.instagram;
    adoptionCenter.twitter = createAdoptionCenter.twitter;
    adoptionCenter.youtube = createAdoptionCenter.youtube;
    adoptionCenter.whatsapp = createAdoptionCenter.whatsapp;

    return await this.adoptionCenterRepository.save(adoptionCenter);
  }

  async update(adoptionCenterDto: AdoptionCenterDto): Promise<AdoptionCenter> {
    const adoptionCenter = await this.adoptionCenterRepository.findOne({
      where: { id: adoptionCenterDto.id },
    });

    if (!adoptionCenter) {
      throw new NotFoundException(messages.adoptionCenterNotFound);
    }

    if (adoptionCenterDto.name) {
      adoptionCenter.name = adoptionCenterDto.name;
    }
    if (adoptionCenterDto.description) {
      adoptionCenter.description = adoptionCenterDto.description;
    }
    if (adoptionCenterDto.active !== undefined) {
      adoptionCenter.active = adoptionCenterDto.active;
    }
    if (adoptionCenterDto.address) {
      adoptionCenter.address = adoptionCenterDto.address;
    }
    if (adoptionCenterDto.phone) {
      adoptionCenter.phone = adoptionCenterDto.phone;
    }
    if (adoptionCenterDto.email) {
      adoptionCenter.email = adoptionCenterDto.email;
    }
    if (adoptionCenterDto.website) {
      adoptionCenter.website = adoptionCenterDto.website;
    }
    if (adoptionCenterDto.facebook) {
      adoptionCenter.facebook = adoptionCenterDto.facebook;
    }
    if (adoptionCenterDto.instagram) {
      adoptionCenter.instagram = adoptionCenterDto.instagram;
    }
    if (adoptionCenterDto.twitter) {
      adoptionCenter.twitter = adoptionCenterDto.twitter;
    }
    if (adoptionCenterDto.youtube) {
      adoptionCenter.youtube = adoptionCenterDto.youtube;
    }
    if (adoptionCenterDto.whatsapp) {
      adoptionCenter.whatsapp = adoptionCenterDto.whatsapp;
    }

    return await this.adoptionCenterRepository.save(adoptionCenter);
  }

  async remove(id: number) {
    const adoptionCenter = await this.findOne(id);

    if (!adoptionCenter) {
      throw new NotFoundException(messages.adoptionCenterNotFound);
    }

    await this.adoptionCenterRepository.delete(id);
    return adoptionCenter;
  }
}
