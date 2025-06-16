import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //chỉ cho phép field có trong DTO
      forbidNonWhitelisted: true, // chặn field lạ
      transform: true, // tự động chuyển kiểu string thành ObjectId, number,
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
