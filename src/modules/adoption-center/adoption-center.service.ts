import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { BaseService } from '@modules/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdoptionCenter } from './entities/adoption-center.entity';
import { AdoptionCenterDto } from './dto/adoption-center.dto';
import { GetFilesByEntityDto } from '@modules/file/file/dto/get-files-entity.dto';
import { FileService } from '@modules/file/file/file.service';
import { PaginationQueryDto } from '@modules/common/dto/pagination/pagination-query.dto';
import { PetsService } from '@modules/pets/pets.service';
import { messages } from 'src/messages/messages';

@Injectable()
export class AdoptionCenterService extends BaseService<
  AdoptionCenter,
  AdoptionCenterDto
> {
  private readonly ADOPTION_CENTER = 'ADOPTION_CENTER';

  constructor(
    @InjectRepository(AdoptionCenter)
    private readonly adoptionCenterRepository: Repository<AdoptionCenter>,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PetsService))
    private readonly petsService: PetsService,
  ) {
    super(adoptionCenterRepository, AdoptionCenterDto);
  }

  async findAll(pagination: PaginationQueryDto) {
    const paginatedResponse = await super.findAll(pagination);
    const adoptionCentersIds = paginatedResponse.data.map((item) => item.id);
    if (adoptionCentersIds.length > 0) {
      const getfileDTO = new GetFilesByEntityDto();
      getfileDTO.entity = this.ADOPTION_CENTER;
      getfileDTO.idEntities = adoptionCentersIds;

      const files = await this.fileService.getFilesByEntity(getfileDTO);

      const filesWithIds = await Promise.all(
        files.map(async (file) => ({
          file,
          idEntity: await file.getIdEntity(),
        })),
      );

      paginatedResponse.data = await Promise.all(
        paginatedResponse.data.map(async (center) => {
          const centerFiles = filesWithIds
            .filter(({ idEntity }) => idEntity === center.id)
            .map(({ file }) => file);

          const processedFiles = await Promise.all(
            centerFiles.map((file) => file.toJson()),
          );

          return {
            ...center,
            files: processedFiles,
          };
        }),
      );
    }

    return paginatedResponse;
  }

  async findOne(id: number): Promise<any> {
    const center = await super.findOne(id);
    if (!center) return null;

    const getfileDTO = new GetFilesByEntityDto();
    getfileDTO.entity = this.ADOPTION_CENTER;
    getfileDTO.idEntities = [id];
    const files = await this.fileService.getFilesByEntity(getfileDTO);

    return {
      ...center,
      files: await Promise.all(files.map((file) => file.toJson())),
    };
  }

  async validateRemove(id: number) {
    const pets = await this.petsService.findByAdoptionCenterId(id);
    if (pets.length > 0) {
      throw new BadRequestException(messages.errorPetsInAdoptionCenter);
    }
  }
}
