export interface IBaseService {
  findAll(...args: any[]): Promise<any>;
  findOne(id: number | string): Promise<any>;
  create(input: any): Promise<any>;
  update(id: number | string, input: any): Promise<any>;
  remove(id: number | string): Promise<any>;
}
