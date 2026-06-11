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

  // NOTE: metrics are aggregated across all businesses (mock service has no
  // per-business breakdown), so we show the per-business average as an approximation.
  get avgClicks(): number {
    if (!this.metrics) return 0;
    const total = this.metrics.last30Days.reduce((s, d) => s + d.clicks, 0);
    return Math.round(total / (this.businesses.length || 1));
  }
}
