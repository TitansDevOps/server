import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from '@modules/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeepPartial } from 'typeorm';
import { PetType } from '@modules/petTypes/entities/pet-type.entity';
import { PetAttributeValue } from '@modules/petTypes/entities/pet-attribute-value.entity';
import { PetTypeDto } from '@modules/petTypes/dto/pet-type.dto';
import { messages } from 'src/messages/messages';
import { Attribute } from '@modules/petTypes/entities/attribute.entity';
import { PaginationQueryDto } from '@modules/common/dto/pagination/pagination-query.dto';

@Injectable()
export class PetTypeService extends BaseService<PetType, PetTypeDto> {
  constructor(
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(PetAttributeValue)
    private readonly attributeValueRepository: Repository<PetAttributeValue>,
  ) {
    super(petTypeRepository, PetTypeDto);
  }

  async findAll(query: PaginationQueryDto): Promise<any> {
    let petTypes = await super.findAll(query);

    let response = await Promise.all(
      petTypes.data.map(async (petType: Partial<PetType>) => {
        const attributes = await this.getAttributesForPetType(petType.id);
        return {
          ...petType,
          attributes: attributes.map((attribute) => attribute.name).join(', '),
        };
      }),
    );

    petTypes.data = response as any;
    return petTypes;
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

  async remove(id: number): Promise<any> {
    const petType = await this.petTypeRepository.findOne({
      where: { id },
      relations: ['attributes'],
    });

    if (!petType) {
      throw new NotFoundException(messages.petTypeNotFound);
    }

    //FIXME: Uncomment this line if you want to remove the attribute values as well
    // await this.attributeValueRepository.remove( );
    await this.petTypeRepository.remove(petType);
    return { success: true };
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
