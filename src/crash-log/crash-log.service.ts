import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class CrashLogService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('API key cho OpenRouter không được tìm thấy');
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          require(path.resolve(__dirname, '../../serviceAccountKey.json')),
        ),
      });
    }
  }

  async analyzeCrash(body: { email: string; userId: string; error: string }) {
    const { email, userId, error } = body;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', // ✅ model miễn phí
        messages: [
          {
            role: 'system',
            content:
              'Bạn là chuyên gia Kotlin Android. Hãy phân tích lỗi crash và đưa ra gợi ý sửa và giải thích ngắn gọn bằng tiếng Việt.',
          },
          {
            role: 'user',
            content: `Lỗi crash:\n${error}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const aiSummary =
      response.data?.choices?.[0]?.message?.content || 'Không có phản hồi từ AI';

    await admin.firestore().collection('crash_logs').add({
      email,
      userId,
      error,
      aiSummary,
      timestamp: Date.now(),
    });

    return {
      message: 'Đã phân tích và lưu',
      aiSummary,
    };
  }
}
