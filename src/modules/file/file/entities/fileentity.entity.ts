import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'file_entity', schema: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeEntity: string;

  @Column()
  entityOwnerId: number;
}
