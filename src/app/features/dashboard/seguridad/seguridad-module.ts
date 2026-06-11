import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Seguridad } from './seguridad/seguridad';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [{ path: '', component: Seguridad }];

@NgModule({
  declarations: [Seguridad],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule]
})
export class SeguridadModule {}
