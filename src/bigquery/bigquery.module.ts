import { Module } from '@nestjs/common';
import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';

@Module({
  controllers: [BigqueryController],
  providers: [BigqueryService],
})
export class BigqueryModule {}
