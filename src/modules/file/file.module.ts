import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@modules/users/entities/user.entity';
import { FileController } from '@modules/file/file/file.controller';
import { ProtectedFileController } from '@modules/file/file/protected-files.controller';
import { PublicFileController } from '@modules/file/file/public-files.controller';
import { File } from '@modules/file/file/entities/file.entity';
import { FileEntity } from '@modules/file/file/entities/fileentity.entity';
import { FileEntityOwner } from '@modules/file/file/entities/fileentityowner.entity';
import { FileService } from '@modules/file/file/file.service';
import { Disk } from '@modules/file/disk/entities/disk.entity';
import { DiskController } from '@modules/file/disk/disk.controller';
import { DiskService } from '@modules/file/disk/disk.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, File, FileEntity, FileEntityOwner, Disk]),
  ],
  controllers: [
    FileController,
    ProtectedFileController,
    PublicFileController,
    DiskController,
  ],
  providers: [FileService, DiskService],
  exports: [FileService],
})
export class FileModule {}
