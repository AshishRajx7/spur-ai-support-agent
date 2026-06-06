import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { LlmModule } from 'src/llm/llm.module';
@Module({
  imports: [ConversationsModule, MessagesModule, KnowledgeModule, LlmModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
