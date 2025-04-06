import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from '@modules/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeepPartial } from 'typeorm';
import { PetType } from '@modules/petTypes/entities/pet-type.entity';
import { PetTypeDto } from '@modules/petTypes/dto/pet-type.dto';
import { messages } from 'src/messages/messages';
import { Attribute } from '@modules/petTypes/entities/attribute.entity';

@Injectable()
export class PetTypeService extends BaseService<PetType, PetTypeDto> {
  constructor(
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {
    super(petTypeRepository, PetTypeDto);
  }

  async findOne(id: number): Promise<Partial<PetType> | null> {
    const petType = await this.petTypeRepository.findOne({
      where: { id },
      relations: ['attributes'],
    });

    if (!petType) {
      return null;
    }

    return new this.dtoClass(petType).toJson();
  }

  async createWithAttributes(
    input: DeepPartial<PetType>,
  ): Promise<Partial<PetType>> {
    if (!input.name || input.name.trim() === '') {
      throw new BadRequestException(
        'El nombre del tipo de mascota es requerido',
      );
    }

    const attributeInputs = input.attributes || [];
    delete input.attributes;

    if (attributeInputs.length > 0) {
      const attributeIds = attributeInputs.map((attr) => attr.id);
      const existingAttributes = await this.attributeRepository.find({
        where: { id: In(attributeIds) },
      });

      if (existingAttributes.length !== attributeIds.length) {
        const foundIds = existingAttributes.map((attr) => attr.id);
        const missingIds = attributeIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(
          `Atributos no encontrados: ${missingIds.join(', ')}`,
        );
      }
    }

    const petType = await this.petTypeRepository.save(
      this.petTypeRepository.create(input),
    );

    if (attributeInputs.length > 0) {
      await this.addAttributesToType(
        petType.id,
        attributeInputs.map((a) => a.id),
      );
    }

    return this.findOne(petType.id);
  }

  async addAttributesToType(
    petTypeId: number,
    attributeIds: number[],
  ): Promise<void> {
    await Promise.all(
      attributeIds.map((attributeId) =>
        this.petTypeRepository
          .createQueryBuilder()
          .relation(PetType, 'attributes')
          .of(petTypeId)
          .add(attributeId),
      ),
    );
  }

  async getAttributesForPetType(petTypeId: number): Promise<Attribute[]> {
    const petType = await this.petTypeRepository.findOne({
      where: { id: petTypeId },
      relations: ['attributes'],
    });

    if (!petType) {
      throw new NotFoundException(messages.petTypeNotFound);
    }
    return petType.attributes;
  }
}
