import { Component, OnInit } from '@angular/core';
import { Business } from '../../../../core/models/business.model';
import { BusinessMockService } from '../../../../core/services/business.mock.service';

@Component({
  selector: 'app-mi-negocio',
  standalone: false,
  templateUrl: './mi-negocio.html',
  styleUrl: './mi-negocio.scss'
})
export class MiNegocio implements OnInit {
  business!: Business;
  saved = false;

  constructor(private businessService: BusinessMockService) {}

  ngOnInit(): void {
    this.business = this.businessService.businesses()[0];
  }

  onSave(data: Business): void {
    this.businessService.updateBusiness(data.id, data).subscribe(() => {
      this.saved = true;
      setTimeout(() => this.saved = false, 3000);
    });
  }
}
