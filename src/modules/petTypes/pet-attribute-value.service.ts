import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PetAttributeValue } from '@modules/petTypes/entities/pet-attribute-value.entity';
@Injectable()
export class PetAttributeValueService {
  constructor(
    @InjectRepository(PetAttributeValue)
    private readonly attributeValueRepository: Repository<PetAttributeValue>,
  ) {}

  async findByPetIds(petIds: number[]) {
    return this.attributeValueRepository.find({
      where: { pet: { id: In(petIds) } },
      relations: ['attribute', 'pet'],
    });
  }

  async saveValues(petId: number, values: any[]) {
    const attributeValues = values.map((av) => ({
      value: av.value,
      attribute: { id: av.attribute.id },
      pet: { id: petId },
    }));

    await this.attributeValueRepository.save(
      this.attributeValueRepository.create(attributeValues),
    );
  }

  async updateValues(petId: number, values: any[]) {
    const existing = await this.attributeValueRepository.find({
      where: { pet: { id: petId } },
    });

    const newIds = values.filter((av) => av.id).map((av) => av.id);
    const toRemove = existing.filter((ev) => !newIds.includes(ev.id));

    if (toRemove.length > 0) {
      await this.attributeValueRepository.remove(toRemove);
    }

    const toSave = values.map((av) => ({
      id: av.id,
      value: av.value,
      attribute: { id: av.attribute.id },
      pet: { id: petId },
    }));

    await this.attributeValueRepository.save(
      this.attributeValueRepository.create(toSave),
    );
  }
}
