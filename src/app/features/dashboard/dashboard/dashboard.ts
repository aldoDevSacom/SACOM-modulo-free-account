import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth.mock.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  constructor(private auth: AuthMockService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get userName(): string {
    return this.auth.currentUser()?.contactName ?? '';
  }
}
