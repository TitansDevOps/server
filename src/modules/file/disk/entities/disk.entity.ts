import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'disk', schema: 'files' })
export class Disk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;
}
