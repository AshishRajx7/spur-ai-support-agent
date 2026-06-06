import { Module } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Knowledge } from './entities/knowledge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Knowledge])],
  providers: [KnowledgeService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
