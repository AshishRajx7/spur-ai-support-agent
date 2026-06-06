import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Knowledge } from './entities/knowledge.entity';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private readonly knowledgeRepository: Repository<Knowledge>,
  ) {}

  async getActiveKnowledge(): Promise<Knowledge[]> {
    return this.knowledgeRepository.find({
      where: {
        isActive: true,
      },
    });
  }
  async getKnowledgeContext(): Promise<string> {
    const knowledge = await this.getActiveKnowledge();

    return knowledge
      .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n');
  }
}
