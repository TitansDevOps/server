import { FileEntity } from '../entities/fileentity.entity';

export class FileEntityDTO {
  entities: FileEntity[];
  type: FileType;
}

export enum FileType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
