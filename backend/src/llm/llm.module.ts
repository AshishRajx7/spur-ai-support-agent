import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { KnowledgeModule } from 'src/knowledge/knowledge.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  imports: [
    ConversationsModule,
    MessagesModule,
    KnowledgeModule,
    LlmModule,
    ConfigModule,
  ],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
