import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'metricas', pathMatch: 'full' },
      {
        path: 'metricas',
        loadChildren: () =>
          import('./metricas/metricas-module').then(m => m.MetricasModule)
      },
      {
        path: 'mi-negocio',
        loadChildren: () =>
          import('./mi-negocio/mi-negocio-module').then(m => m.MiNegocioModule)
      },
      {
        path: 'seguridad',
        loadChildren: () =>
          import('./seguridad/seguridad-module').then(m => m.SeguridadModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
