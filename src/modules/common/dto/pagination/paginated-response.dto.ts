export class PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;

  constructor(partial: Partial<PaginatedResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
