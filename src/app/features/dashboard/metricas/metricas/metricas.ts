import { Component, OnInit } from '@angular/core';
import { MetricsMockService } from '../../../../core/services/metrics.mock.service';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { AuthMockService } from '../../../../core/services/auth.mock.service';
import { DailyMetric, Metrics } from '../../../../core/models/metrics.model';
import { Business } from '../../../../core/models/business.model';

@Component({
  selector: 'app-metricas',
  standalone: false,
  templateUrl: './metricas.html',
  styleUrl: './metricas.scss'
})
export class Metricas implements OnInit {
  businesses: Business[] = [];
  metrics: Metrics | null = null;
  chartData: DailyMetric[] = [];
  totalClicks = 0;
  totalImpressions = 0;

  drawerOpen = false;
  drawerMode: 'detail' | 'edit' | 'add' = 'detail';
  selectedBusiness: Business | null = null;

  get userName(): string {
    return this.auth.currentUser()?.contactName ?? '';
  }

  get ctr(): string {
    if (!this.totalImpressions) return '0%';
    return ((this.totalClicks / this.totalImpressions) * 100).toFixed(1) + '%';
  }

  constructor(
    private metricsService: MetricsMockService,
    private businessService: BusinessMockService,
    private auth: AuthMockService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.businesses = this.businessService.businesses();
    const ids = this.businesses.map(b => b.id);
    if (!ids.length) {
      this.metrics = null;
      this.chartData = [];
      this.totalClicks = 0;
      this.totalImpressions = 0;
      return;
    }
    this.metricsService.getMetrics(ids).subscribe(m => {
      this.metrics = m;
      this.chartData = m.last30Days;
      this.totalClicks = m.last30Days.reduce((s, d) => s + d.clicks, 0);
      this.totalImpressions = m.last30Days.reduce((s, d) => s + d.impressions, 0);
    });
  }

  openDrawerDetail(biz: Business): void {
    this.selectedBusiness = biz;
    this.drawerMode = 'detail';
    this.drawerOpen = true;
  }

  openDrawerAdd(): void {
    this.selectedBusiness = null;
    this.drawerMode = 'add';
    this.drawerOpen = true;
  }

  closeDrawer(): void { this.drawerOpen = false; }

  onDrawerSaved(_biz: Business): void {
    this.closeDrawer();
    this.loadData();
  }

  onDrawerDeleted(_id: string): void {
    this.closeDrawer();
    this.loadData();
  }
}
