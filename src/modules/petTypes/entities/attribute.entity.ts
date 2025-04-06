import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PetType } from '@modules/petTypes/entities/pet-type.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('simple-array')
  allowedValues: string[];

  @ManyToMany(() => PetType, (petType) => petType.attributes)
  @JoinTable({
    name: 'pet_type_attributes',
    joinColumn: { name: 'attribute_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'pet_type_id', referencedColumnName: 'id' },
  })
  petTypes: PetType[];
}
