import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './schema/skill.shcema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Skill.name,
        schema: SkillSchema,
      },
    ]),
  ],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
