import { PartialType } from '@nestjs/mapped-types';
import { CreateReportPostDto } from './create-report-post.dto';

export class UpdateReportPostDto extends PartialType(CreateReportPostDto) {}
