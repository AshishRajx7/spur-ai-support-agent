import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [ConversationsModule, MessagesModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
