import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../messages/entities/message.entity';
import { Knowledge } from '../knowledge/entities/knowledge.entity';


export default new DataSource({
  type: 'postgres',

  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),

  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  entities: [Conversation, Message, Knowledge],

  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
});
