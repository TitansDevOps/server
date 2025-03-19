import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { FileEntity } from '@modules/file/file/entities/fileentity.entity';
import { File } from '@modules/file/file/entities/file.entity';

@Entity({ name: 'file_entity_owner', schema: 'files' })
export class FileEntityOwner {
  @PrimaryColumn()
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'idEntity' })
  idEntity: number;

  @PrimaryColumn()
  @ManyToOne(() => File)
  @JoinColumn({ name: 'idFile' })
  idFile: number;
}
