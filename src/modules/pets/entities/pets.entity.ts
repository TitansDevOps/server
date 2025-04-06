import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import { PetType } from '@modules/petTypes/entities/pet-type.entity';
import { PetAttributeValue } from '@modules/petTypes/entities/pet-attribute-value.entity';

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

  @ManyToOne(() => PetType, (petType) => petType.pets)
  petType: PetType;

  @OneToMany(() => PetAttributeValue, (attrValue) => attrValue.pet, {
    cascade: true,
  })
  attributeValues: PetAttributeValue[];
}
