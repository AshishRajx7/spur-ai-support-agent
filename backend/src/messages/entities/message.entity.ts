import { Conversation } from '../../conversations/entities/conversation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @ManyToOne(() => Conversation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'conversationId',
  })
  conversation: Conversation;

  @Column()
  sender: string;

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
