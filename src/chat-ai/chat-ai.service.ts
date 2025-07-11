// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatAiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly API_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

  async getChatCompletion(prompt: string): Promise<string> {
    try {
      const API_CHAT_KEY = this.configService.get<string>('CHATBOTAI'); 

      const headers = {
        'Authorization': `Bearer ${API_CHAT_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'ChatApp',
      };

      const body = {
        model: 'openai/gpt-3.5-turbo-16k',
        messages: [
          { role: 'user', content: prompt },
        ],
      };

      const response = await firstValueFrom(
        this.httpService.post(this.API_CHAT_URL, body, { headers })
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('❌ Error calling OpenRouter:', error?.response?.data || error.message);
      return 'Lỗi khi kết nối AI';
    }
  }
}
