import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('knowledge')
export class Knowledge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column()
  question: string;

  @Column('text')
  answer: string;

  @Column({
    default: true,
  })
  isActive: boolean;
}