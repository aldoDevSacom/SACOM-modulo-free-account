import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BusinessAddress } from '../../../../core/models/business.model';

@Component({
  selector: 'app-map-picker',
  standalone: false,
  templateUrl: './map-picker.html',
  styleUrl: './map-picker.scss'
})
export class MapPicker implements OnInit {
  @Input() lat = 19.4195;
  @Input() lng = -99.1674;
  @Output() addressChange = new EventEmitter<BusinessAddress>();

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 14;

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    clickableIcons: false
  };

  ngOnInit(): void {
    this.center = { lat: this.lat, lng: this.lng };
    this.markerPosition = { lat: this.lat, lng: this.lng };
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    this.geocode(event.latLng.lat(), event.latLng.lng());
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.markerPosition = { lat, lng };
    this.geocode(lat, lng);
  }

  private geocode(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) return;
      const result = results[0];
      const get = (type: string) =>
        result.address_components.find(c => c.types.includes(type))?.long_name ?? '';

      this.addressChange.emit({
        fullAddress: result.formatted_address,
        street: get('route'),
        exteriorNumber: get('street_number'),
        colony: get('sublocality_level_1') || get('neighborhood'),
        postalCode: get('postal_code'),
        city: get('locality') || get('administrative_area_level_1'),
        state: get('administrative_area_level_1'),
        lat,
        lng
      });
    });
  }
}
