import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Dùng ValidationPipe để kiểm tra input từ DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép field có trong DTO
      forbidNonWhitelisted: true, // Chặn field lạ
      transform: true, // Tự động convert kiểu (string → number/ObjectId)
    }),
  );

  // ✅ Gắn Exception Filter toàn cục (để log lỗi lên Google Sheets)
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
