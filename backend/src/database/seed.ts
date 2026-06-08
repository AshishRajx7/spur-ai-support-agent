import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { SeedService } from './seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);

  await seedService.run();

  await app.close();

  console.log('Database seeding completed.');

  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('Database seeding failed:', error);

  process.exit(1);
});
