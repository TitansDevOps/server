import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'file', schema: 'files' })
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  filename: string;

  @Column({ nullable: true })
  filePath: string;

  @Column()
  ext: string;

  @Column()
  type: string;

  @Column()
  fileDate: Date;

  @Column()
  size: number;
}
