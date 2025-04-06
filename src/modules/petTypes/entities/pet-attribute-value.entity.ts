import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pets } from '@modules/pets/entities/pets.entity';
import { Attribute } from '@modules/petTypes/entities/attribute.entity';

@Entity('pet_attribute_values')
export class PetAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pets, (pet) => pet.attributeValues)
  pet: Pets;

  @ManyToOne(() => Attribute)
  attribute: Attribute;

  @Column()
  value: string;
}
