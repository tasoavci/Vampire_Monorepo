import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`\n\nApp is running on port: ${process.env.BACKEND_PORT} \n\n`)
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
