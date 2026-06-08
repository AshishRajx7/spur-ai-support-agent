import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  sendMessage(@Body() dto: SendMessageDto): Promise<ChatResponseDto> {
    return this.chatService.sendMessage(dto);
  }

  @Get('history/:sessionId')
  getHistory(@Param('sessionId') sessionId: string) {
    return this.chatService.getHistory(sessionId);
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
