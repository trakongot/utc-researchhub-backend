import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { config } from './share';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(config);

  await app.listen(config.port ?? 3000);
}
bootstrap().catch((err) => console.error(err));
