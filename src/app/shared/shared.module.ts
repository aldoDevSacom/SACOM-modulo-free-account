import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordStrengthComponent } from './components/password-strength/password-strength.component';

@NgModule({
  declarations: [PasswordStrengthComponent],
  imports: [CommonModule],
  exports: [PasswordStrengthComponent, CommonModule]
})
export class SharedModule {}
