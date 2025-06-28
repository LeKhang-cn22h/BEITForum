import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Tags, TagsSchema } from './schema/tags.schema';
@Module({
    imports: [MongooseModule.forFeature([{
            name: Tags.name,
            schema: TagsSchema,
          },
          
          ])
          ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
