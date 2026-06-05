import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(
    conversationId: string,
    sender: string,
    text: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      conversationId,
      sender,
      text,
    });

    return this.messageRepository.save(message);
  }

  async getHistory(conversationId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversationId },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
