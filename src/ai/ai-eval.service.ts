// src/ai/ai-eval.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiEvalService {
  constructor(private readonly configService: ConfigService) {}

  async evaluatePost(reason: string, title: string, content: string) {
  const API_KEY = this.configService.get<string>('CHECK_REPORT');
  const API_URL = 'https://openrouter.ai/v1/chat/completions';
  const prompt = `
You are an AI content moderator. I will provide a report reason, post title, and post content.

Your task is:

1. Analyze whether the content violates the given reason (e.g., offensive language, harassment, spam, etc.).
2. Respond **only** in the following JSON format:

{
  "violationPercentage": (a number from 0 to 100),
  "reason": (a short sentence explaining the result),
  "shouldBan": true if violationPercentage >= 75, otherwise false
}

--- Post Information ---

Report reason: ${reason}

Title: ${title}

Content: ${content}

Respond **strictly in JSON** format without any explanation.
`;


  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'google/gemma-3-4b-it:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('🤖 AI full response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      console.warn('⚠️ AI không trả về choices.');
      return {
        violationPercentage: 0,
        reason: 'AI không trả lời',
        shouldBan: false,
      };
    }

    const aiText =
      response.data.choices[0].message?.content ??
      response.data.choices[0].text ??
      '';

    try {
      const result = JSON.parse(aiText);
      return result;
    } catch (err) {
      console.warn('⚠️ JSON.parse lỗi, nội dung:', aiText);
      return {
        violationPercentage: 0,
        reason: 'Phản hồi AI không hợp lệ',
        shouldBan: false,
        raw: aiText,
      };
    }
  } catch (err: any) {
    console.error('❌ Lỗi khi gọi API AI:', err.response?.data || err.message);
    return {
      violationPercentage: 0,
      reason: 'Lỗi khi gọi AI',
      shouldBan: false,
    };  
  }
}
}
