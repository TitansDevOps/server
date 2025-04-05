import { PaginateOptions } from '@modules/common/interfaces/pagination-options.interface';
import { PaginatedResponseDto } from '@modules/common/dto/pagination/paginated-response.dto';

export async function paginate<T>({
  repository,
  pagination,
  where,
  order,
  relations,
}: PaginateOptions<T>): Promise<PaginatedResponseDto<T>> {
  const { page, limit } = pagination;

  const [data, total] = await repository.findAndCount({
    where,
    order,
    relations,
    take: limit,
    skip: (page - 1) * limit,
  });

  return new PaginatedResponseDto<T>({
    data,
    total,
    page,
    limit,
    lastPage: Math.ceil(total / limit),
  });
}
