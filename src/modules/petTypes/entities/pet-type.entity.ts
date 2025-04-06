import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Attribute } from '@modules/petTypes/entities/attribute.entity';
import { Pets } from '@modules/pets/entities/pets.entity';

@Entity()
export class PetType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Attribute, (attribute) => attribute.petTypes)
  attributes: Attribute[];

  @OneToMany(() => Pets, (pet) => pet.petType)
  pets: Pets[];
}
