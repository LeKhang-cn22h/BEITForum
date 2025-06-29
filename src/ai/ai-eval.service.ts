// src/ai/ai-eval.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiEvalService {
  constructor(private readonly configService: ConfigService) {}

  async evaluatePost(reason: string, title: string, content: string) {
    const API_KEY = this.configService.get<string>('CHECK_REPORT');
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

   const prompt = `
Bạn là một hệ thống AI kiểm duyệt nội dung bài viết trong diễn đàn sinh viên. Nhiệm vụ của bạn là:

1. Đọc kỹ **lý do người dùng tố cáo** bài viết.
2. Phân tích **tiêu đề** và **nội dung** bài viết để xác định xem nội dung có **vi phạm đúng theo lý do đó hay không**.
3. Đánh giá mức độ vi phạm và trả về kết quả **dưới dạng JSON hợp lệ**, theo mẫu bên dưới.

=== YÊU CẦU JSON OUTPUT ===
Trả lời phải đúng theo cấu trúc sau (không giải thích, không thêm văn bản ngoài JSON):

{
  "violationPercentage": <số nguyên từ 0 đến 100>,  // mức độ vi phạm so với lý do
  "reason": "<1 câu ngắn gọn giải thích tại sao>",
  "shouldBan": <true nếu violationPercentage >= 75, ngược lại false>
}

=== HƯỚNG DẪN ĐÁNH GIÁ ===
- Nếu tiêu đề và nội dung **không liên quan gì đến lý do tố cáo** → violationPercentage = 0.
- Nếu bài viết **có dấu hiệu một phần vi phạm** lý do → violationPercentage từ 1 đến 74.
- Nếu bài viết **rõ ràng và nghiêm trọng vi phạm** lý do → violationPercentage từ 75 đến 100.
- Trả về shouldBan bằng true nếu vi phạm từ 75% trở lên.

=== DỮ LIỆU PHÂN TÍCH ===

Lý do tố cáo: ${reason}

Tiêu đề bài viết: ${title}

Nội dung bài viết: ${content}

=== LƯU Ý QUAN TRỌNG ===
- Chỉ trả lời JSON, không thêm bất kỳ văn bản nào bên ngoài.
- Phân tích phải chính xác theo dữ liệu đã cung cấp.
- Không bịa thêm dữ kiện ngoài nội dung và lý do đã cho.
`;



    const response = await axios.post(
      API_URL,
      {
        model: 'mistralai/mistral-7b-instruct', 
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`, // đính kèm key
          'Content-Type': 'application/json',
        },
      },
    );

    const aiText = response.data.choices[0].message.content;

    try {
      const result = JSON.parse(aiText);
      return result;
    } catch (err) {
      return {
        violationPercentage: 0,
        reason: 'Không thể phân tích',
        shouldBan: false,
        raw: aiText,
      };
    }
  }
}
