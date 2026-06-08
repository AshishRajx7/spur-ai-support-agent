import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      service: 'ShopSpur Support Agent API',
      status: 'running',
      docs: '/api',
      health: '/chat/health',
    };
  }
}