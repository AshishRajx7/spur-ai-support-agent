import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private readonly redisService: RedisService,
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

    const saved = await this.messageRepository.save(message);

    await this.redisService.del(`conversation:${conversationId}:history`);

    return saved;
  }

  async getHistory(conversationId: string): Promise<Message[]> {
    const cacheKey = `conversation:${conversationId}:history`;

    console.log('GET HISTORY CALLED');

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      console.log('CACHE HIT');
      return JSON.parse(cached) as Message[];
    }

    console.log('CACHE MISS');

    const history = await this.messageRepository.find({
      where: { conversationId },
      order: {
        createdAt: 'ASC',
      },
    });
    await this.redisService.set(cacheKey, JSON.stringify(history), 3600);

    return history;
  }
}
