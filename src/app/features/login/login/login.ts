import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth.mock.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  form!: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthMockService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.auth.login(this.email.value, this.password.value).subscribe(success => {
      this.loading = false;
      if (success) {
        this.router.navigate(['/dashboard/metricas']);
      } else {
        this.errorMsg = 'Correo o contraseña incorrectos.';
      }
    });
  }
}
