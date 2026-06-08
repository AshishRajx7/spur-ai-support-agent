import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { Message } from '../messages/entities/message.entity';
import { LLMProvider } from './llm.interface';
import { buildSupportPrompt, buildUserMessage } from './prompts';

@Injectable()
export class LlmService implements LLMProvider {
  private readonly logger = new Logger(LlmService.name);

  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('LLM_API_KEY'),
      baseURL: this.configService.get<string>('LLM_API_URL'),
    });
  }

  async generateReply(
    history: Message[],
    userMessage: string,
    knowledgeContext: string,
  ): Promise<string> {
    try {
      const messages = [
        {
          role: 'system' as const,
          content: buildSupportPrompt(knowledgeContext),
        },

        ...history.map((message) => ({
          role:
            message.sender === 'USER'
              ? ('user' as const)
              : ('assistant' as const),
          content: message.text,
        })),

        {
          role: 'user' as const,
          content: buildUserMessage(userMessage), // grounds the final turn
        },
      ];

      const completion = await this.client.chat.completions.create({
        model: this.configService.get<string>('LLM_MODEL')!,
        messages,
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 300, // tighter = less room to hallucinate
      });

      return (
        completion.choices[0]?.message?.content?.trim() ??
        'I could not generate a response.'
      );
    } catch (error) {
      this.logger.error(error);

      return 'I am currently unable to process your request. Please try again later.';
    }
  }
}
