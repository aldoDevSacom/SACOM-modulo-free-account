import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Metricas } from './metricas/metricas';
import { LineChart } from './line-chart/line-chart';
import { KpiCard } from './kpi-card/kpi-card';
import { BusinessListCard } from './business-list-card/business-list-card';

const routes: Routes = [{ path: '', component: Metricas }];

@NgModule({
  declarations: [Metricas, LineChart, KpiCard, BusinessListCard],
  imports: [CommonModule, RouterModule.forChild(routes), BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class MetricasModule {}
