import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Knowledge } from '../knowledge/entities/knowledge.entity';
import { SeedService } from './seeds/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Knowledge])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
