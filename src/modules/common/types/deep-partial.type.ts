export type CustomDeepPartial<T> = {
  [P in keyof T]?: CustomDeepPartial<T[P]>;
};
