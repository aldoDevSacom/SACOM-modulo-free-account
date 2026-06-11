export interface DailyMetric {
  date: string;
  clicks: number;
  impressions: number;
}

export interface Metrics {
  businessId: string;
  last30Days: DailyMetric[];
}
