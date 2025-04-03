import { FileEntity } from '@modules/file/file/entities/fileentity.entity';

export class SaveFilesTransporter {
  public fileEntity: FileEntity;
  public uploadsDir: string;
  public filePathOrigin: string;

  constructor(
    fileEntity: FileEntity,
    uploadsDir: string,
    filePathOrigin: string,
  ) {
    this.fileEntity = fileEntity;
    this.uploadsDir = uploadsDir;
    this.filePathOrigin = filePathOrigin;
  }
}
