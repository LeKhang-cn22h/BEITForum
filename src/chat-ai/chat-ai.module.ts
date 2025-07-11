import { Module } from '@nestjs/common';
import { ChatAiController } from './chat-ai.controller';
import { ChatAiService } from './chat-ai.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ChatAiController],
  providers: [ChatAiService],
})
export class ChatAiModule {}
