import { PartialType } from '@nestjs/mapped-types';
import { VoteDto } from './vote.dto';

export class UpdateVoteDto extends PartialType(VoteDto) {}
