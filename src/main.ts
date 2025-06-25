import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import axios from 'axios'; 

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
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // app.useGlobalFilters(new AllExceptionsFilter());
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  // ✅ Gắn Exception Filter toàn cục (để log lỗi lên Google Sheets)
  // app.useGlobalFilters(new AllExceptionsFilter());

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
