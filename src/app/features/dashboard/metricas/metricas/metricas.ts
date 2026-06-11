import { Component, OnInit } from '@angular/core';
import { MetricsMockService } from '../../../../core/services/metrics.mock.service';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { DailyMetric } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-metricas',
  standalone: false,
  templateUrl: './metricas.html',
  styleUrl: './metricas.scss'
})
export class Metricas implements OnInit {
  data: DailyMetric[] = [];
  totalClicks = 0;
  totalImpressions = 0;

  constructor(
    private metricsService: MetricsMockService,
    private businessService: BusinessMockService
  ) {}

  ngOnInit(): void {
    const bizId = this.businessService.business().id;
    this.metricsService.getMetrics(bizId).subscribe(m => {
      this.data = m.last30Days;
      this.totalClicks = this.data.reduce((s, d) => s + d.clicks, 0);
      this.totalImpressions = this.data.reduce((s, d) => s + d.impressions, 0);
    });
  }
}
