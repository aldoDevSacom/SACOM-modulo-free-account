import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapPicker } from './map-picker';

describe('MapPicker', () => {
  let component: MapPicker;
  let fixture: ComponentFixture<MapPicker>;

  beforeEach(async () => {
    // Mock google.maps global to avoid "google is not defined" in tests
    (window as any)['google'] = {
      maps: {
        Geocoder: class {
          geocode(_req: any, _cb: any) {}
        },
        MapMouseEvent: class {}
      }
    };

    await TestBed.configureTestingModule({
      declarations: [MapPicker],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize center and markerPosition from inputs', () => {
    component.lat = 19.4195;
    component.lng = -99.1674;
    component.ngOnInit();
    expect(component.center).toEqual({ lat: 19.4195, lng: -99.1674 });
    expect(component.markerPosition).toEqual({ lat: 19.4195, lng: -99.1674 });
  });

  it('should update markerPosition on map click', () => {
    const mockEvent = {
      latLng: {
        lat: () => 20.0,
        lng: () => -100.0
      }
    } as any;
    // Spy to avoid calling real geocoder
    spyOn<any>(component, 'geocode');
    component.onMapClick(mockEvent);
    expect(component.markerPosition).toEqual({ lat: 20.0, lng: -100.0 });
  });

  it('should do nothing on map click when latLng is null', () => {
    const mockEvent = { latLng: null } as any;
    spyOn(component.addressChange, 'emit');
    component.onMapClick(mockEvent);
    expect(component.addressChange.emit).not.toHaveBeenCalled();
  });
});
