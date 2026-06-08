import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversations/entities/conversation.entity';
import { Message } from './messages/entities/message.entity';
import { Knowledge } from './knowledge/entities/knowledge.entity';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { LlmModule } from './llm/llm.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),

        entities: [Conversation, Message, Knowledge],

        synchronize: false,
      }),
    }),

    ConversationsModule,

    MessagesModule,

    KnowledgeModule,

    LlmModule,

    RedisModule,

    ChatModule,

    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
