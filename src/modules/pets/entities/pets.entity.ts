import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'pets' })
export class Pets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true, nullable: false })
  active: boolean;

  @Column({ name: 'adoptionCenterId', nullable: false })
  adoptionCenterId: number;

  @ManyToOne(() => AdoptionCenter, (adoptionCenter) => adoptionCenter.pets)
  @JoinColumn({
    name: 'adoptionCenterId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'pets_adoption_center_fk',
  })
  adoptionCenter: AdoptionCenter;
}
