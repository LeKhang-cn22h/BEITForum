import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import axios from 'axios'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  // ✅ Gửi request tự ping đến chính mình mỗi 14 phút
  const appUrl = process.env.APP_URL ?? `https://beitforum.onrender.com`; 

  setInterval(() => {
    axios.get(`${appUrl}/ping`)
      .then(() => console.log('Self-ping sent to keep Render awake'))
      .catch((err) => console.error('Self-ping failed:', err.message));
  }, 14 * 60 * 1000); // 14 phút
}
bootstrap();
