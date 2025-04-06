import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination/pagination-query.dto';

export interface PaginateOptions<T> {
  repository: Repository<T>;
  pagination: PaginationQueryDto;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  order?: FindManyOptions<T>['order'];
  relations?: FindManyOptions<T>['relations'];
}
