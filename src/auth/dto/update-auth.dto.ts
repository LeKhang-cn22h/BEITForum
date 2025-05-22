import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signupdto';

export class UpdateAuthDto extends PartialType(SignUpDto) {}
