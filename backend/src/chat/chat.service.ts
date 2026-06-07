import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { LlmService } from 'src/llm/llm.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly knowledgeService: KnowledgeService,
    private readonly llmService: LlmService,
  ) {}

  async sendMessage(dto: SendMessageDto): Promise<ChatResponseDto> {
    const conversation = dto.sessionId
      ? ((await this.conversationsService.findById(dto.sessionId)) ??
        (await this.conversationsService.createConversation()))
      : await this.conversationsService.createConversation();

    await this.messagesService.create(conversation.id, 'USER', dto.message);

    const knowledgeContext = await this.knowledgeService.getKnowledgeContext();

    const history = (
      await this.messagesService.getHistory(conversation.id)
    ).slice(-4);

    const aiReply = await this.llmService.generateReply(
      history,
      dto.message,
      knowledgeContext,
    );

    await this.messagesService.create(conversation.id, 'AI', aiReply);

    return {
      reply: aiReply,
      sessionId: conversation.id,
    };
  }
  async getHistory(sessionId: string) {
    return this.messagesService.getHistory(sessionId);
  }
}
