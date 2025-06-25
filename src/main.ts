import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let serviceAccount;

 try {
      const serviceAccountPath = './src/firebase/firebase-config.json';
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } catch (error) {
      console.error('Error loading Firebase service account from Render secrets:', error);
      process.exit(1);
    }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //chỉ cho phép field có trong DTO
      forbidNonWhitelisted: true, // chặn field lạ
      transform: true, // tự động chuyển kiểu string thành ObjectId, number,
    }),
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  // ✅ Gắn Exception Filter toàn cục (để log lỗi lên Google Sheets)
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
