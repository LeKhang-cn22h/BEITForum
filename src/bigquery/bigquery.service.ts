import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import * as path from 'path';

@Injectable()
export class BigqueryService {
  private bigquery: BigQuery;

  constructor() {
    this.bigquery = new BigQuery({
       keyFilename: path.join(__dirname, 'D:/chuyen_de_tt/BE/BEITForum/src/credentials/itforum-e2eea.json'),

    });
  }

  async getEventData(date: string): Promise<any[]> {
    const query = `
      SELECT * FROM \`itforum-e2eea.analytics_492305155.events_${date}\`
      LIMIT 100
    `;
    const [job] = await this.bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    return rows;
  }
}
