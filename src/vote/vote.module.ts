import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schema/vote.schema';

@Module({
  imports: [MongooseModule.forFeature([{
        name: Vote.name,
        schema: VoteSchema,
      },
      ])
      ],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
