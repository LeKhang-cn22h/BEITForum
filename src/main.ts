import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //chỉ cho phép field có trong DTO
      forbidNonWhitelisted: true, // chặn field lạ
      transform: true, // tự động chuyển kiểu string thành ObjectId, number,
    }),
  );

  // ✅ Gắn Exception Filter toàn cục (để log lỗi lên Google Sheets)
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
