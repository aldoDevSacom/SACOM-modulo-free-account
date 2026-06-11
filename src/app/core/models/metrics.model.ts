export interface DailyMetric {
  date: string;
  clicks: number;
  impressions: number;
}

export interface Metrics {
  businessIds: string[];
  last30Days: DailyMetric[];
}
