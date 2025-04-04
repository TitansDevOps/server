// category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { messages } from 'src/messages/messages';
import { GetFilesByEntityDto } from '@modules/file/file/dto/get-files-entity.dto';
import { FileService } from '@modules/file/file/file.service';
import { Pets } from '@modules/pets/entities/pets.entity';
import { PetsDto } from '@modules/pets/dto/pets.dto';
import { AdoptionCenterService } from '@modules/adoption-center/adoption-center.service';

@Injectable()
export class PetsService {
  private PET = 'PET';

  constructor(
    @InjectRepository(Pets)
    private readonly petsRepository: Repository<Pets>,
    private readonly fileService: FileService,
    private readonly adoptionCenterService: AdoptionCenterService,
  ) {}

  async findAll() {
    const pets = await this.petsRepository.find();

    const petsIds = await Promise.all(pets.map((pet) => pet.id));

    const getfileDTO = new GetFilesByEntityDto();
    getfileDTO.entity = this.PET;
    const idEntities = [];
    idEntities.push(...petsIds);
    getfileDTO.idEntities = idEntities;

    const files = await this.fileService.getFilesByEntity(getfileDTO);

    const response = await Promise.all(
      pets.map(async (pet) => {
        const petModel = new PetsDto().fromModel(pet);
        petModel.files = await Promise.all(
          files.map(async (file) => {
            if ((await file.getIdEntity()) === pet.id) {
              return await file.toJson();
            }
          }),
        );
        return petModel.toJSON();
      }),
    );

    return response;
  }

  async findOne(id: number): Promise<PetsDto> {
    const pet = await this.findModel(id);
    const getfileDTO = new GetFilesByEntityDto();
    getfileDTO.entity = this.PET;
    getfileDTO.idEntities = [pet.id];

    const files = await this.fileService.getFilesByEntity(getfileDTO);

    const petModel = new PetsDto().fromModel(pet);
    petModel.files = await Promise.all(
      files.map(async (file) => await file.toJson()),
    );

    return petModel;
  }

  async create(createPetDto: PetsDto): Promise<PetsDto> {
    const adoptionCenter = await this.adoptionCenterService.findOne(
      createPetDto.adoptionCenter.id,
    );

    if (!adoptionCenter) {
      throw new NotFoundException(messages.adoptionCenterNotFound);
    }

    const pet = new Pets();
    pet.name = createPetDto.name;
    pet.description = createPetDto.description;
    pet.active = true;
    pet.adoptionCenterId = adoptionCenter.id;
    const newPet = await this.petsRepository.save(pet);

    const petWithAdoptionCenter = await this.petsRepository.findOne({
      where: { id: newPet.id },
      relations: ['adoptionCenter'],
    });

    return new PetsDto().fromModel(petWithAdoptionCenter);
  }

  async update(petDto: PetsDto): Promise<PetsDto> {
    const pet = await this.petsRepository.findOne({
      where: { id: petDto.id },
    });

    if (!pet) {
      throw new NotFoundException(messages.petNotFound);
    }

    if (petDto.name) {
      pet.name = petDto.name;
    }

    if (petDto.description) {
      pet.description = petDto.description;
    }

    if (petDto.active !== undefined) {
      pet.active = petDto.active;
    }

    if (petDto.adoptionCenter.id) {
      const adoptionCenter = await this.adoptionCenterService.findOne(
        petDto.adoptionCenter.id,
      );
      if (!adoptionCenter) {
        throw new NotFoundException(messages.adoptionCenterNotFound);
      }

      pet.adoptionCenterId = petDto.adoptionCenter.id;
    }

    const newPet = await this.petsRepository.save(pet);
    const petWithAdoptionCenter = await this.petsRepository.findOne({
      where: { id: newPet.id },
      relations: ['adoptionCenter'],
    });

    return new PetsDto().fromModel(petWithAdoptionCenter);
  }

  async remove(id: number) {
    const pet = await this.findModel(id);
    await this.petsRepository.delete(id);
    return pet;
  }

  private async findModel(id: number): Promise<Pets> {
    const pet = await this.petsRepository.findOne({
      where: { id: id },
    });
    if (!pet) {
      throw new NotFoundException(messages.petNotFound);
    }
    return pet;
  }
}
