import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { VoteService } from './vote.service';
import {  VoteDto } from './dto/vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { use } from 'passport';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

 // Vote cho mot post cu the
 @Post(':postId')
 @HttpCode(HttpStatus.OK)
 async votePost(
   @Param('postId') postId: string,
   @Body() voteDto: VoteDto
 ) {
   try {
     const result = await this.voteService.votes(postId, voteDto);
     return {
       statusCode: HttpStatus.OK,
       message: 'Vote processed successfully',
       data: result
     };
   } catch (error) {
     throw error;
   }
 }

 @Get(':postId/:userId')
 @HttpCode(HttpStatus.OK)
  async getPostVotes(@Param('postId') postId: string, @Param('userId') userId: string) {
    try {
      const votes = await this.voteService.getVoteByPostId(postId,userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Vote data retrieved successfully',
        data: votes
      };
    } catch (error) {
      throw error;
    }
}}
