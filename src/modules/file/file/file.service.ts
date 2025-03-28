import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { File } from '@modules/file/file/entities/file.entity';
import { FileEntity } from '@modules/file/file/entities/fileentity.entity';
import { FileEntityOwner } from '@modules/file/file/entities/fileentityowner.entity';
import { CreateFileEntityDto } from '@modules/file/file/dto/create-file.dto';
import { DeleteFileDto } from '@modules/file/file/dto/delete-file.dto';
import { GetFilesByEntityDto } from '@modules/file/file/dto/get-files-entity.dto';
import { FileEntityDTO } from '@modules/file/file/dto/file-entity.dto';

import { FileType } from '@modules/file/file/dto/file-entity.dto';
import { ObjectFile } from '@modules/file/file/dto/file.dto';

import { PublicFileEntity, PrivateFileEntity } from './utils/file.entities';
import { FileRoutes } from '@modules/file/file/utils/file-routes';

import { unlink } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';
import { messages } from 'src/messages/messages';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,

    @InjectRepository(FileEntity)
    private fileEntityRepository: Repository<FileEntity>,

    @InjectRepository(FileEntityOwner)
    private fileEntityOwnerRepository: Repository<FileEntityOwner>,
  ) {}

  /**
   * This function saves the files in the database and in the server
   * @param files
   * @param createFileEntityDto
   * @returns void
   */
  async saveFiles(
    files: Array<Express.Multer.File>,
    createFileEntityDto: CreateFileEntityDto,
  ) {
    const fileEntityPublic = PublicFileEntity.find((fileEntity) => {
      return fileEntity === createFileEntityDto.typeEntity;
    });

    const fileEntityPrivate = PrivateFileEntity.find((fileEntity) => {
      return fileEntity === createFileEntityDto.typeEntity;
    });

    let filePathOrigin = `uploads/private/${createFileEntityDto.typeEntity.toLowerCase()}/`;
    let isPublic = false;
    if (fileEntityPublic) {
      isPublic = true;
      filePathOrigin = `uploads/public/${createFileEntityDto.typeEntity.toLowerCase()}/`;
    }

    if (!fileEntityPrivate && !isPublic) {
      throw new HttpException(
        messages.errorFileEntityNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    let fileEntity = await this.fileEntityRepository.findOne({
      where: {
        typeEntity: createFileEntityDto.typeEntity,
        entityOwnerId: createFileEntityDto.entityOwnerId,
      },
    });

    if (!fileEntity) {
      fileEntity = this.fileEntityRepository.create(createFileEntityDto);
      fileEntity = await this.fileEntityRepository.save(fileEntity);
    }

    const savedFiles = [];
    let uploadsDir = isPublic
      ? path.join(__dirname, '../../../uploads/public/')
      : path.join(__dirname, '../../../uploads/private/');
    uploadsDir = uploadsDir + createFileEntityDto.typeEntity.toLowerCase();

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      const randomName = `${Date.now()}${extname(file.originalname)}`;
      const filePath = path.join(uploadsDir, randomName);
      fs.writeFileSync(filePath, file.buffer);
      const fileInfo = {
        name: file.originalname,
        filename: randomName,
        ext: extname(file.originalname).slice(1),
        type: file.mimetype,
        fileDate: new Date(),
        size: file.size,
        filePath: filePathOrigin + randomName,
      };
      const savedFile = await this.fileRepository.save(
        this.fileRepository.create(fileInfo),
      );
      savedFiles.push(savedFile);
      const fileEntityOwner = this.fileEntityOwnerRepository.create({
        idEntity: fileEntity.id,
        idFile: savedFile.id,
      });
      await this.fileEntityOwnerRepository.save(fileEntityOwner);
    }

    return savedFiles;
  }

  /**
   * Delete files by id from database and delete the file from the server
   * @param deleteFileDto
   * @returns void
   */
  async deleteFile(deleteFileDto: DeleteFileDto) {
    try {
      let deletedFiles = [];

      await Promise.all(
        deleteFileDto.file.map(async (oFile) => {
          const FileEntityOwner = await this.fileEntityOwnerRepository.findOne({
            where: { idFile: oFile.id },
          });

          if (FileEntityOwner) {
            await this.fileEntityOwnerRepository.delete(FileEntityOwner);
          }

          const file = await this.fileRepository.findOne({
            where: { id: oFile.id },
          });

          if (!file) {
            throw new Error(messages.errorFileNotFound);
          }

          const entityFile = await this.fileEntityRepository.findOne({
            where: {
              id: FileEntityOwner.idEntity,
            },
          });

          if (!entityFile) {
            throw new Error(messages.errorGettingFilePath);
          }

          await this.fileRepository.delete(file.id);

          const fileEntityPublic = PublicFileEntity.find((fileEntity) => {
            return fileEntity === entityFile.typeEntity;
          });

          const fileEntityPrivate = PrivateFileEntity.find((fileEntity) => {
            return fileEntity === entityFile.typeEntity;
          });

          let entityFileType = null;
          if (fileEntityPublic) {
            entityFileType = FileType.PUBLIC;
          }
          if (fileEntityPrivate) {
            entityFileType = FileType.PRIVATE;
          }

          const filePathOrigin = path.join(
            __dirname,
            `../../../uploads/${entityFileType}/${entityFile.typeEntity.toLocaleLowerCase()}/${file.filename}`,
          );

          await new Promise((resolve, reject) => {
            unlink(filePathOrigin, (err) => {
              if (err) {
                return reject(new Error(`Error deleting file: ${err.message}`));
              }
              resolve(null);
            });
          });

          deletedFiles = [...deletedFiles, file];
        }),
      );

      return deletedFiles;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Get files by entity, example: getFilesByEntity('PRODUCT', [1,2,3])
   * @param getFilesByEntityDto
   * @returns <ObjectFile[]>
   */
  async getFilesByEntity(
    getFilesByEntityDto: GetFilesByEntityDto,
  ): Promise<ObjectFile[]> {
    const fileEntity =
      await this.validateIfEntityExistsAndGetFileEntity(getFilesByEntityDto);
    const filesEntityOwner = await this.fileEntityOwnerRepository.find({
      where: {
        idEntity: In(
          await Promise.all(
            fileEntity.entities.map((fileEntity) => fileEntity.id),
          ),
        ),
      },
    });

    const idFiles = await Promise.all(
      filesEntityOwner.map(async (filesEntityOwner) => {
        return filesEntityOwner.idFile;
      }),
    );

    const flattenedIdFiles = await Promise.all(idFiles.flat());

    const files = await this.fileRepository.find({
      where: {
        id: In(flattenedIdFiles),
      },
    });

    const controllerRoute =
      fileEntity.type === FileType.PUBLIC
        ? FileRoutes.public
        : FileRoutes.private;

    const response: ObjectFile[] = files.map((file) => {
      const entityOwnerId = filesEntityOwner.find(
        (fileEntityOwner) => fileEntityOwner.idFile === file.id,
      );
      const entity = fileEntity.entities.find(
        (fileEntity) => fileEntity.id === entityOwnerId.idEntity,
      );

      return new ObjectFile(
        file.id,
        entity.typeEntity.toLocaleLowerCase(),
        entity.entityOwnerId,
        new Date(file.fileDate),
        file.type,
        file.size,
        file.filename,
        `${controllerRoute}/${entity.typeEntity.toLocaleLowerCase()}/${file.filename}`,
      );
    });

    return response;
  }

  /**
   * Validate if the entity exists
   * @param getFilesByEntityDto
   * @returns <FileEntityDTO>
   */

  async validateIfEntityExistsAndGetFileEntity(
    getFilesByEntityDto: GetFilesByEntityDto,
  ): Promise<FileEntityDTO> {
    const fileEntityPublic = PublicFileEntity.find((fileEntity) => {
      return fileEntity === getFilesByEntityDto.entity;
    });

    const fileEntityPrivate = PrivateFileEntity.find((fileEntity) => {
      return fileEntity === getFilesByEntityDto.entity;
    });

    if (!fileEntityPrivate && !fileEntityPublic) {
      throw new Error(messages.errorFileEntityNotFound);
    }

    let entityFileType = FileType.PUBLIC;
    if (fileEntityPrivate) {
      entityFileType = FileType.PRIVATE;
    }

    const fileEntity = await this.fileEntityRepository.find({
      where: {
        typeEntity: getFilesByEntityDto.entity,
        entityOwnerId: In(getFilesByEntityDto.idEntities),
      },
    });

    if (!fileEntity) {
      throw new Error(messages.errorFileEntityNotFound);
    }

    const response: FileEntityDTO = {
      entities: fileEntity,
      type: entityFileType,
    };

    return response;
  }
}
