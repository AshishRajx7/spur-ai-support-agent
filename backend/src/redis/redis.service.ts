import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client
      .connect()
      .then(() => console.log('REDIS CONNECTED'))
      .catch((err) => console.error(err));
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);

    console.log('REDIS GET', key, value ? 'FOUND' : 'NOT FOUND');

    return value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    console.log('REDIS SET', key);

    if (ttlSeconds) {
      await this.client.set(key, value, {
        EX: ttlSeconds,
      });

      return;
    }

    await this.client.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
