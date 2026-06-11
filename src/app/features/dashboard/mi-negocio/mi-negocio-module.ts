import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MiNegocio } from './mi-negocio/mi-negocio';
import { BusinessForm } from './business-form/business-form';
import { MapPicker } from './map-picker/map-picker';

const routes: Routes = [{ path: '', component: MiNegocio }];

@NgModule({
  declarations: [MiNegocio, BusinessForm, MapPicker],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), GoogleMapsModule]
})
export class MiNegocioModule {}
