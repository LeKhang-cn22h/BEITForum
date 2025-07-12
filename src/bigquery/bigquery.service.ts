


import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import * as path from 'path';
import * as fs from 'fs';


@Injectable()
export class BigqueryService {
  private bigquery: BigQuery;

  constructor() {
    let keyPath: string;

    const isProd = process.env.NODE_ENV === 'production';

    // ✅ Đường dẫn chuẩn theo yêu cầu
    keyPath = isProd
      ? '/etc/secrets/firebase-config.json'
      : path.resolve(__dirname, '../../src/firebase/firebase-config.json');

    // 🔍 Kiểm tra sự tồn tại của file
    if (!fs.existsSync(keyPath)) {
      console.error(`❌ Firebase config file not found at: ${keyPath}`);
      process.exit(1);
    }

    console.log(
      isProd
        ? '🔐 Loaded Firebase config from /etc/secrets'
        : '💻 Loaded Firebase config from local path'
    );

    // ⚙️ Khởi tạo BigQuery với key file
    this.bigquery = new BigQuery({
      keyFilename: keyPath,
    });
  }

  async getEventDataLast7Days(): Promise<any[]> {
    const query = `
  -- Lấy số lần truy cập mỗi màn hình
  WITH screen_views AS (
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = "firebase_screen") AS screen_name,
      COUNT(*) AS view_count
    FROM \`itforum-e2eea.analytics_492305155.events_*\`
    WHERE event_name = "screen_view"
      AND PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    GROUP BY screen_name
  ),

  -- Lấy tổng thời gian ở mỗi màn hình
  screen_exits AS (
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = "screen_name") AS screen_name,
      SUM((SELECT value.int_value FROM UNNEST(event_params) WHERE key = "duration_seconds")) AS total_duration
    FROM \`itforum-e2eea.analytics_492305155.events_*\`
    WHERE event_name = "screen_exit"
      AND PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    GROUP BY screen_name
  )

  -- Gộp 2 bảng lại theo screen_name
  SELECT
    v.screen_name,
    v.view_count,
    COALESCE(e.total_duration, 0) AS total_duration_seconds
  FROM screen_views v
  LEFT JOIN screen_exits e ON v.screen_name = e.screen_name
  WHERE v.screen_name IS NOT NULL
    AND NOT STARTS_WITH(v.screen_name, "detail_")  -- 🔥 Loại bỏ screen_name bắt đầu với "detail_"
  ORDER BY v.view_count DESC
`;


    const [job] = await this.bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    return rows;
  }
}
