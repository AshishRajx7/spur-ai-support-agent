import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Knowledge } from '../../knowledge/entities/knowledge.entity';
import { KNOWLEDGE_SEED } from './knowledge.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Knowledge)
    private readonly knowledgeRepository: Repository<Knowledge>,
  ) {}

  async run(): Promise<void> {
    await this.seedKnowledge();
  }

  private async seedKnowledge(): Promise<void> {
    await this.knowledgeRepository.delete({});
    await this.knowledgeRepository.save(KNOWLEDGE_SEED);
    console.log(`Seeded ${KNOWLEDGE_SEED.length} knowledge records.`);
  }
}
