import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  async sendMessage(dto: SendMessageDto): Promise<ChatResponseDto> {
    const conversation = dto.sessionId
      ? ((await this.conversationsService.findById(dto.sessionId)) ??
        (await this.conversationsService.createConversation()))
      : await this.conversationsService.createConversation();

    await this.messagesService.create(conversation.id, 'USER', dto.message);

    const aiReply = `ShopSpur AI: ${dto.message}`;

    await this.messagesService.create(conversation.id, 'AI', aiReply);

    return {
      reply: aiReply,
      sessionId: conversation.id,
    };
  }
}
