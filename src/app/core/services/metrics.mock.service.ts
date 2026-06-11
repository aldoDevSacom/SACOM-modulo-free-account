import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DailyMetric, Metrics } from '../models/metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsMockService {

  getMetrics(businessIds: string[]): Observable<Metrics> {
    const perBusiness = businessIds.map(id => this.generateForId(id));
    return of({ businessIds, last30Days: this.aggregate(perBusiness) });
  }

  private generateForId(id: string): DailyMetric[] {
    const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (29 - i));
      const s = (i + 1) * seed;
      return {
        date: d.toISOString().split('T')[0],
        clicks: Math.floor(Math.abs(Math.sin(s * 0.23)) * 80) + 15,
        impressions: Math.floor(Math.abs(Math.cos(s * 0.17)) * 300) + 80
      };
    });
  }

  private aggregate(perBusiness: DailyMetric[][]): DailyMetric[] {
    if (!perBusiness.length) return [];
    return perBusiness[0].map((day, i) => ({
      date: day.date,
      clicks: perBusiness.reduce((sum, biz) => sum + biz[i].clicks, 0),
      impressions: perBusiness.reduce((sum, biz) => sum + biz[i].impressions, 0)
    }));
  }
}
