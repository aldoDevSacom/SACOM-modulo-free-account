import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, BusinessAddress } from '../../../../core/models/business.model';
import { BusinessMockService } from '../../../../core/services/business.mock.service';

@Component({
  selector: 'app-business-form',
  standalone: false,
  templateUrl: './business-form.html',
  styleUrl: './business-form.scss'
})
export class BusinessForm implements OnInit {
  @Input() business!: Business;
  @Output() saveEvent = new EventEmitter<Business>();

  form!: FormGroup;
  logoPreview = '';

  constructor(private fb: FormBuilder, private businessService: BusinessMockService) {}

  ngOnInit(): void {
    this.logoPreview = this.business.logoUrl;
    this.form = this.fb.group({
      contactName: [this.business.contactName, Validators.required],
      contactEmail: [this.business.contactEmail, [Validators.required, Validators.email]],
      contactPhone: [this.business.contactPhone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      businessName: [this.business.businessName, Validators.required],
      category: [this.business.category, Validators.required],
      website: [this.business.website],
      publicPhone: [this.business.publicPhone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      products: [this.business.products, Validators.required],
      fullAddress: [this.business.address.fullAddress],
      street: [this.business.address.street],
      exteriorNumber: [this.business.address.exteriorNumber],
      colony: [this.business.address.colony],
      postalCode: [this.business.address.postalCode],
      city: [this.business.address.city],
      state: [this.business.address.state],
      lat: [this.business.address.lat],
      lng: [this.business.address.lng],
      allDay: [this.business.hours.allDay],
      wdOpen: [this.business.hours.weekdays?.open ?? ''],
      wdClose: [this.business.hours.weekdays?.close ?? ''],
      satOpen: [this.business.hours.saturday?.open ?? ''],
      satClose: [this.business.hours.saturday?.close ?? ''],
      sunOpen: [this.business.hours.sunday?.open ?? ''],
      sunClose: [this.business.hours.sunday?.close ?? '']
    });
  }

  onLogoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.businessService.uploadLogo(file).subscribe(url => {
      this.logoPreview = url;
    });
  }

  onAddressChange(addr: BusinessAddress): void {
    this.form.patchValue({
      fullAddress: addr.fullAddress,
      street: addr.street,
      exteriorNumber: addr.exteriorNumber,
      colony: addr.colony,
      postalCode: addr.postalCode,
      city: addr.city,
      state: addr.state,
      lat: addr.lat,
      lng: addr.lng
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const updated: Business = {
      ...this.business,
      contactName: v.contactName,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone,
      businessName: v.businessName,
      category: v.category,
      website: v.website,
      publicPhone: v.publicPhone,
      products: v.products,
      logoUrl: this.logoPreview,
      address: {
        fullAddress: v.fullAddress,
        street: v.street,
        exteriorNumber: v.exteriorNumber,
        colony: v.colony,
        postalCode: v.postalCode,
        city: v.city,
        state: v.state,
        lat: v.lat,
        lng: v.lng
      },
      hours: {
        allDay: v.allDay,
        weekdays: v.allDay ? null : { open: v.wdOpen, close: v.wdClose },
        saturday: v.allDay ? null : { open: v.satOpen, close: v.satClose },
        sunday: v.allDay ? null : { open: v.sunOpen, close: v.sunClose }
      }
    };
    this.saveEvent.emit(updated);
  }

  onCancel(): void {
    this.ngOnInit();
  }
}
