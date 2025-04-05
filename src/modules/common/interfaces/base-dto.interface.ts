export interface IBaseDto<T> {
  toList(): Partial<T>;
  toJson(): Partial<T>;
}
