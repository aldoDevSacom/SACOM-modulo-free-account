import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Metricas } from './metricas/metricas';
import { LineChart } from './line-chart/line-chart';
import { KpiCard } from './kpi-card/kpi-card';
import { BusinessListCard } from './business-list-card/business-list-card';
import { BusinessDrawer } from '../components/business-drawer/business-drawer';

const routes: Routes = [{ path: '', component: Metricas }];

@NgModule({
  declarations: [Metricas, LineChart, KpiCard, BusinessListCard, BusinessDrawer],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), GoogleMapsModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class MetricasModule {}
