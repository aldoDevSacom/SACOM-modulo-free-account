import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DailyMetric } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-line-chart',
  standalone: false,
  templateUrl: './line-chart.html'
})
export class LineChart implements OnChanges {
  @Input() data: DailyMetric[] = [];

  chartData: ChartData<'line'> = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  ngOnChanges(): void {
    if (!this.data.length) return;
    this.chartData = {
      labels: this.data.map(d => {
        const [, m, day] = d.date.split('-');
        return `${day}/${m}`;
      }),
      datasets: [
        {
          label: 'Clics',
          data: this.data.map(d => d.clicks),
          borderColor: '#FFD800',
          backgroundColor: 'rgba(255,216,0,0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Impresiones',
          data: this.data.map(d => d.impressions),
          borderColor: '#333333',
          backgroundColor: 'rgba(51,51,51,0.05)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  }
}
