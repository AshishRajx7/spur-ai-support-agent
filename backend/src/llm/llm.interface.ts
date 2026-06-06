import { Message } from 'src/messages/entities/message.entity';
export interface LLMProvider {
  generateReply(
    history: Message[],
    userMessage: string,
    knowledgeContext: string,
  ): Promise<string>;
}
