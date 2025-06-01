import { Module } from '@nestjs/common';
import { ReportAccountController } from './report-account.controller';
import { ReportAccountService } from './report-account.service';
import { MongooseModule} from '@nestjs/mongoose';
import { ReportAccount,ReportAccountSchema } from './schema/report-account.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: ReportAccount.name, schema:ReportAccountSchema}])
  ],
  controllers: [ReportAccountController],
  providers: [ReportAccountService]

})
export class ReportAccountModule {}
