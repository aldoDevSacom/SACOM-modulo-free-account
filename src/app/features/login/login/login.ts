import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthMockService, DEMO_USER } from '../../../core/services/auth.mock.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  form!: FormGroup;
  loading = false;

  readonly demoEmail = DEMO_USER.email;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthMockService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() { return this.form.get('email')!; }

  fillDemo(): void {
    this.form.setValue({ email: DEMO_USER.email });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.loginOtp(this.email.value).subscribe(() => {
      this.loading = false;
      this.router.navigate(['/dashboard/metricas']);
    });
  }
}
