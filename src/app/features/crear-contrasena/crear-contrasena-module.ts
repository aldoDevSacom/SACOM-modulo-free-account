import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearContrasenaRoutingModule } from './crear-contrasena-routing-module';
import { CrearContrasena } from './crear-contrasena/crear-contrasena';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CrearContrasena
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrearContrasenaRoutingModule,
    SharedModule
  ]
})
export class CrearContrasenaModule { }
