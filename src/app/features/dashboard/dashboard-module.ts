import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Header } from './components/header/header';
import { NavLateral } from './components/nav-lateral/nav-lateral';
import { NavInferior } from './components/nav-inferior/nav-inferior';


@NgModule({
  declarations: [
    Dashboard,
    Header,
    NavLateral,
    NavInferior
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
