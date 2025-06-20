import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:'*'
  // origin: ['http://localhost:8080','http://localhost:8081', 'https://your-frontend.com'],
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // credentials: true,
  });
  console.log(process.env.DB_STORAGE);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000,'0.0.0.0');
}
bootstrap();
