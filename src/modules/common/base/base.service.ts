import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { PaginationQueryDto } from '@modules/common/dto/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@modules/common/dto/pagination/paginated-response.dto';
import { paginate } from '@modules/common/helpers/paginate';
import { IBaseDto } from '@modules/common/interfaces/base-dto.interface';
import { IBaseService } from '@modules/common/interfaces/base-service.interface';
import { messages } from 'src/messages/messages';

export abstract class BaseService<T, Dto extends IBaseDto<T>>
  implements IBaseService
{
  protected entityNotFound: string = messages.entityNotFound;
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly dtoClass: new (entity: T) => Dto,
  ) {}

  async findAll(
    pagination: PaginationQueryDto,
    where?: FindOptionsWhere<T>,
  ): Promise<PaginatedResponseDto<Partial<T>>> {
    const paginated = await paginate({
      repository: this.repository,
      pagination,
      where,
      order: { id: 'ASC' } as any,
    });

    return new PaginatedResponseDto<Partial<T>>({
      ...paginated,
      data: paginated.data.map((item) => new this.dtoClass(item).toList()),
    });
  }

  async findOne(id: number): Promise<Partial<T> | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) return null;
    return new this.dtoClass(entity).toJson();
  }

  async create(input: DeepPartial<T>): Promise<Partial<T>> {
    const entity = this.repository.create(input);
    const saved = await this.repository.save(entity);
    return new this.dtoClass(saved).toJson();
  }

  async update(id: number, input: DeepPartial<T>): Promise<Partial<T>> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) throw new NotFoundException(this.entityNotFound);

    const updated = this.repository.merge(entity, input);
    const saved = await this.repository.save(updated);
    return new this.dtoClass(saved).toJson();
  }

  async remove(id: number): Promise<any> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) throw new NotFoundException(this.entityNotFound);

    await this.repository.remove(entity);
    return { success: true };
  }
}
