import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContrasena } from './crear-contrasena/crear-contrasena';

const routes: Routes = [
  { path: '', component: CrearContrasena }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearContrasenaRoutingModule { }
