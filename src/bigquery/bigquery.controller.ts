// import { Controller, Get, Query } from '@nestjs/common';
// import { BigqueryService } from './bigquery.service';

// @Controller('api/events')
// export class BigqueryController {
//   constructor(private readonly bigqueryService: BigqueryService) {}

//   @Get()
//   async getEvents(@Query('date') date: string) {
//     console.log('Nhận request tại /api/events?date=' + date);
//     if (!date) return { message: 'Missing date param' };
//     const data = await this.bigqueryService.getEventData(date);
//     return data;
//   }
// }
import { Controller, Get } from '@nestjs/common';
import { BigqueryService } from './bigquery.service';

@Controller('api/events')
export class BigqueryController {
  constructor(private readonly bigqueryService: BigqueryService) {}

  @Get()
  async getEventsLast7Days() {
    console.log('Truy vấn sự kiện 7 ngày gần nhất');
    return this.bigqueryService.getEventDataLast7Days();
  }
}
