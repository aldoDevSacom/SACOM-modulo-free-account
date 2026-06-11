import { Component, EventEmitter, Input, NgZone, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, BusinessAddress } from '../../../../core/models/business.model';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { Metrics } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-business-drawer',
  standalone: false,
  templateUrl: './business-drawer.html',
  styleUrl: './business-drawer.scss'
})
export class BusinessDrawer implements OnChanges {
  @Input() mode: 'detail' | 'edit' | 'add' = 'detail';
  @Input() business: Business | null = null;
  @Input() metrics: Metrics | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Business>();
  @Output() deleted = new EventEmitter<string>();

  internalMode: 'detail' | 'edit' | 'add' = 'detail';
  form!: FormGroup;
  logoPreview = '';
  currentStep = 1;

  mapCenter: google.maps.LatLngLiteral = { lat: 19.4195, lng: -99.1674 };
  markerPosition: google.maps.LatLngLiteral = { lat: 19.4195, lng: -99.1674 };
  zoom = 14;
  mapOptions: google.maps.MapOptions = { clickableIcons: false };

  get totalClicks(): number {
    if (!this.metrics) return 0;
    return this.metrics.last30Days.reduce((s, d) => s + d.clicks, 0);
  }

  get totalImpressions(): number {
    if (!this.metrics) return 0;
    return this.metrics.last30Days.reduce((s, d) => s + d.impressions, 0);
  }

  get ctr(): string {
    const t = this.totalImpressions;
    if (!t) return '0%';
    return ((this.totalClicks / t) * 100).toFixed(1) + '%';
  }

  constructor(private fb: FormBuilder, private businessService: BusinessMockService, private ngZone: NgZone) {}

  ngOnChanges(): void {
    this.internalMode = this.mode;
    if (this.mode === 'edit' && this.business) {
      this.buildForm();
      this.logoPreview = this.business.logoUrl;
      this.mapCenter = { lat: this.business.address.lat, lng: this.business.address.lng };
      this.markerPosition = { lat: this.business.address.lat, lng: this.business.address.lng };
    }
    if (this.mode === 'add') {
      this.buildForm();
      this.currentStep = 1;
      this.logoPreview = '';
    }
  }

  private buildForm(): void {
    const b = this.business;
    this.form = this.fb.group({
      contactName:  [b?.contactName  ?? '', Validators.required],
      contactEmail: [b?.contactEmail ?? '', [Validators.required, Validators.email]],
      contactPhone: [b?.contactPhone ?? '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      businessName: [b?.businessName ?? '', Validators.required],
      category:     [b?.category     ?? '', Validators.required],
      website:      [b?.website      ?? ''],
      publicPhone:  [b?.publicPhone  ?? '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      products:     [b?.products     ?? '', Validators.required],
      fullAddress:  [b?.address.fullAddress ?? ''],
      street:       [b?.address.street      ?? ''],
      exteriorNumber:[b?.address.exteriorNumber ?? ''],
      colony:       [b?.address.colony      ?? ''],
      postalCode:   [b?.address.postalCode  ?? ''],
      city:         [b?.address.city        ?? ''],
      state:        [b?.address.state       ?? ''],
      lat:          [b?.address.lat         ?? 19.4195],
      lng:          [b?.address.lng         ?? -99.1674],
      allDay:       [b?.hours.allDay        ?? false],
      wdOpen:       [b?.hours.weekdays?.open  ?? ''],
      wdClose:      [b?.hours.weekdays?.close ?? ''],
      satOpen:      [b?.hours.saturday?.open  ?? ''],
      satClose:     [b?.hours.saturday?.close ?? ''],
      sunOpen:      [b?.hours.sunday?.open    ?? ''],
      sunClose:     [b?.hours.sunday?.close   ?? '']
    });
  }

  switchToEdit(): void { this.internalMode = 'edit'; this.buildForm(); if (this.business) { this.logoPreview = this.business.logoUrl; this.mapCenter = { lat: this.business.address.lat, lng: this.business.address.lng }; this.markerPosition = { ...this.mapCenter }; } }
  switchToDetail(): void { this.internalMode = 'detail'; }

  onLogoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.businessService.uploadLogo(file).subscribe(url => this.logoPreview = url);
  }

  onAddressChange(addr: BusinessAddress): void {
    this.form.patchValue({ ...addr });
    this.markerPosition = { lat: addr.lat, lng: addr.lng };
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.markerPosition = { lat, lng };
    this.geocode(lat, lng);
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    this.geocode(event.latLng.lat(), event.latLng.lng());
  }

  private geocode(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      this.ngZone.run(() => {
        if (status !== 'OK' || !results?.[0]) return;
        const r = results[0];
        const get = (type: string) => r.address_components.find(c => c.types.includes(type))?.long_name ?? '';
        this.onAddressChange({
          fullAddress: r.formatted_address,
          street: get('route'),
          exteriorNumber: get('street_number'),
          colony: get('sublocality_level_1') || get('neighborhood'),
          postalCode: get('postal_code'),
          city: get('locality') || get('administrative_area_level_1'),
          state: get('administrative_area_level_1'),
          lat, lng
        });
      });
    });
  }

  onSave(): void {
    if (!this.form || this.form.invalid) return;
    const v = this.form.value;
    const data: Omit<Business, 'id' | 'userId'> = {
      contactName: v.contactName, contactEmail: v.contactEmail, contactPhone: v.contactPhone,
      businessName: v.businessName, category: v.category, website: v.website,
      publicPhone: v.publicPhone, products: v.products, logoUrl: this.logoPreview,
      categoryCode: this.business?.categoryCode ?? 0,
      address: { fullAddress: v.fullAddress, street: v.street, exteriorNumber: v.exteriorNumber,
        colony: v.colony, postalCode: v.postalCode, city: v.city, state: v.state,
        lat: v.lat, lng: v.lng },
      hours: { allDay: v.allDay,
        weekdays: v.allDay ? null : { open: v.wdOpen, close: v.wdClose },
        saturday: v.allDay ? null : { open: v.satOpen, close: v.satClose },
        sunday: v.allDay ? null : { open: v.sunOpen, close: v.sunClose } }
    };
    if (this.internalMode === 'edit' && this.business) {
      this.businessService.updateBusiness(this.business.id, data).subscribe(b => this.saved.emit(b));
    } else {
      this.businessService.addBusiness(data).subscribe(b => this.saved.emit(b));
    }
  }

  onDelete(): void {
    if (!this.business) return;
    if (!confirm(`¿Eliminar "${this.business.businessName}"? Esta acción no se puede deshacer.`)) return;
    this.businessService.deleteBusiness(this.business.id).subscribe(() => {
      this.deleted.emit(this.business!.id);
    });
  }

  nextStep(): void { if (this.currentStep < 3) this.currentStep++; }
  prevStep(): void { if (this.currentStep > 1) this.currentStep--; }
}
