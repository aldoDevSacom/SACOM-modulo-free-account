import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthMockService } from '../../../../core/services/auth.mock.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const np = control.get('newPassword')?.value;
  const cp = control.get('confirmPassword')?.value;
  return np && cp && np !== cp ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-seguridad',
  standalone: false,
  templateUrl: './seguridad.html',
  styleUrl: './seguridad.scss'
})
export class Seguridad implements OnInit {
  form!: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthMockService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get newPassword() { return this.form.get('newPassword')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  onSubmit(): void {
    if (this.form.invalid) return;
    const current = this.auth.currentUser();
    if (!current || current.password !== this.form.value.currentPassword) {
      this.errorMsg = 'La contraseña actual es incorrecta.';
      return;
    }
    const updated = { ...current, password: this.form.value.newPassword };
    sessionStorage.setItem('sa_user', JSON.stringify(updated));
    this.auth.currentUser.set(updated);
    this.successMsg = '¡Contraseña actualizada correctamente!';
    this.errorMsg = '';
    this.form.reset();
  }
}
