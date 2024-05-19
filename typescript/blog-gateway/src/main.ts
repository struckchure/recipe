import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';
import { RpcExceptionFilter } from 'src/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen(3000);
}
bootstrap();
