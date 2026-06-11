import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Business } from '../../../../core/models/business.model';
import { Metrics } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-business-list-card',
  standalone: false,
  templateUrl: './business-list-card.html',
  styleUrl: './business-list-card.scss'
})
export class BusinessListCard {
  @Input() businesses: Business[] = [];
  @Input() metrics: Metrics | null = null;
  @Output() businessSelected = new EventEmitter<Business>();
  @Output() addRequested = new EventEmitter<void>();

  // NOTE: metrics here are aggregated across all businesses (the mock service
  // does not expose per-business breakdowns), so we show the per-business
  // average as an approximation.
  getBusinessMetrics(): { clicks: number; impressions: number } {
    if (!this.metrics) return { clicks: 0, impressions: 0 };
    const clicks = this.metrics.last30Days.reduce((s, d) => s + d.clicks, 0);
    const impressions = this.metrics.last30Days.reduce((s, d) => s + d.impressions, 0);
    const count = this.businesses.length || 1;
    return { clicks: Math.round(clicks / count), impressions: Math.round(impressions / count) };
  }
}
