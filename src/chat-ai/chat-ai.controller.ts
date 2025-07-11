
import { Controller, Post, Body } from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';

@Controller('chat-ai')
export class ChatAiController {
  constructor(private readonly chatAiService: ChatAiService) {}

  @Post('chat')
  async getAiRespone(@Body('prompt') prompt: string) {
    const response = await this.chatAiService.getChatCompletion(prompt);
    return { response };
  }
}
