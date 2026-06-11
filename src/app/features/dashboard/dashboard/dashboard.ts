import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth.mock.service';
import { BusinessMockService } from '../../../core/services/business.mock.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  businessName: string;

  constructor(
    private auth: AuthMockService,
    private businessService: BusinessMockService,
    private router: Router
  ) {
    this.businessName = this.businessService.business().businessName;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
