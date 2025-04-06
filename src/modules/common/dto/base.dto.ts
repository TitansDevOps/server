import { IBaseDto } from '@modules/common/interfaces/base-dto.interface';

export abstract class BaseDto<T> implements IBaseDto<T> {
  public constructor(protected entity: T) {}

  abstract toList(): Partial<T>;
  abstract toJson(): Partial<T>;
}
