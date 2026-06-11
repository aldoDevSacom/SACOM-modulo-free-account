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

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 4,
          useBorderRadius: true,
          font: { family: 'Inter', size: 11 },
          color: '#666666',
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleFont: { family: 'Inter', size: 11, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: 'Inter', size: 10 },
          color: '#999999',
          maxRotation: 0,
          callback: (_val, index) => (index % 5 === 0 ? this.data[index]?.date.slice(5).replace('-', '/') : '')
        }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#F0F0F0' },
        border: { display: false, dash: [4, 4] },
        ticks: {
          font: { family: 'Inter', size: 10 },
          color: '#999999',
          maxTicksLimit: 5
        }
      }
    }
  };

  ngOnChanges(): void {
    if (!this.data.length) return;
    this.chartData = {
      labels: this.data.map(d => d.date.slice(5).replace('-', '/')),
      datasets: [
        {
          label: 'Clics',
          data: this.data.map(d => d.clicks),
          backgroundColor: '#FFD800',
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.65,
          categoryPercentage: 0.75
        },
        {
          label: 'Impresiones',
          data: this.data.map(d => d.impressions),
          backgroundColor: '#1A1A1A',
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.65,
          categoryPercentage: 0.75
        }
      ]
    };
  }
}
