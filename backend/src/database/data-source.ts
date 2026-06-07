import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../messages/entities/message.entity';
import { Knowledge } from '../knowledge/entities/knowledge.entity';
console.log('NODE_ENV:', process.env.NODE_ENV);
export default new DataSource({
  type: 'postgres',

  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),

  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  entities: [Conversation, Message, Knowledge],

  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/database/migrations/*.js'
      : 'src/database/migrations/*.ts',
  ],

  synchronize: false,
});
