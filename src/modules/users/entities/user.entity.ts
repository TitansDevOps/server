import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  fullName: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Column({ length: 300, nullable: false })
  password: string;

  @Column({ length: 40, nullable: false })
  role: string;

  @Column({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({ length: 50, nullable: false })
  address: string;

  @Column({ length: 20, nullable: false })
  phone: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;
}
