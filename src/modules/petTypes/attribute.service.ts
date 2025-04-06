import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from '@modules/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, ILike } from 'typeorm';
import { Attribute } from '@modules/petTypes/entities/attribute.entity';
import { AttributeDto } from '@modules/petTypes/dto/attribute.dto';
import { messages } from 'src/messages/messages';

@Injectable()
export class AttributeService extends BaseService<Attribute, AttributeDto> {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {
    super(attributeRepository, AttributeDto);
  }

  async create(input: DeepPartial<Attribute>): Promise<Partial<Attribute>> {
    const existingAttribute = await this.attributeRepository.findOne({
      where: {
        name: ILike(input.name),
      },
    });

    if (existingAttribute) {
      throw new BadRequestException(messages.attributeAlreadyExists);
    }

    if (input.allowedValues && !Array.isArray(input.allowedValues)) {
      throw new BadRequestException(messages.error);
    }

    return super.create(input);
  }

  async update(
    id: number,
    input: DeepPartial<Attribute>,
  ): Promise<Partial<Attribute>> {
    return super.update(id, input);
  }
}
