import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DailyMetric, Metrics } from '../models/metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsMockService {
  getMetrics(businessId: string): Observable<Metrics> {
    return of({ businessIds: [businessId], last30Days: this.generate() });
  }

  private generate(): DailyMetric[] {
    const result: DailyMetric[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const s = i + 1;
      result.push({
        date: d.toISOString().split('T')[0],
        clicks: Math.floor(Math.abs(Math.sin(s * 2.3)) * 80) + 15,
        impressions: Math.floor(Math.abs(Math.cos(s * 1.7)) * 300) + 80
      });
    }
    return result;
  }
}
