import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BusinessForm } from './business-form';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { Business } from '../../../../core/models/business.model';

const mockBusiness: Business = {
  id: 'biz-001',
  userId: 'usr-001',
  businessName: 'Taquería El Buen Sabor',
  contactName: 'Juan Pérez García',
  contactEmail: 'juan@buensabor.com',
  contactPhone: '5551234567',
  categoryCode: 5812,
  category: 'Restaurantes',
  website: 'https://www.buensabor.com',
  publicPhone: '5559876543',
  products: 'tacos, quesadillas',
  logoUrl: '',
  address: {
    fullAddress: 'Av. Insurgentes Sur 123',
    street: 'Av. Insurgentes Sur',
    exteriorNumber: '123',
    colony: 'Roma Norte',
    postalCode: '06700',
    city: 'Ciudad de México',
    state: 'CDMX',
    lat: 19.4195,
    lng: -99.1674
  },
  hours: {
    allDay: false,
    weekdays: { open: '08:00', close: '22:00' },
    saturday: { open: '09:00', close: '23:00' },
    sunday: { open: '10:00', close: '21:00' }
  }
};

describe('BusinessForm', () => {
  let component: BusinessForm;
  let fixture: ComponentFixture<BusinessForm>;
  let mockService: jasmine.SpyObj<BusinessMockService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('BusinessMockService', ['uploadLogo']);
    mockService.uploadLogo.and.returnValue(of('data:image/png;base64,abc'));

    await TestBed.configureTestingModule({
      declarations: [BusinessForm],
      imports: [ReactiveFormsModule],
      providers: [{ provide: BusinessMockService, useValue: mockService }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessForm);
    component = fixture.componentInstance;
    component.business = mockBusiness;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with business data', () => {
    expect(component.form.value.businessName).toBe('Taquería El Buen Sabor');
    expect(component.form.value.contactEmail).toBe('juan@buensabor.com');
  });

  it('should emit saveEvent on valid submit', () => {
    spyOn(component.saveEvent, 'emit');
    component.onSubmit();
    expect(component.saveEvent.emit).toHaveBeenCalled();
  });

  it('should patch address fields when onAddressChange is called', () => {
    const addr = {
      fullAddress: 'Nueva Dir',
      street: 'Calle X',
      exteriorNumber: '5',
      colony: 'Col Y',
      postalCode: '12345',
      city: 'CDMX',
      state: 'CDMX',
      lat: 20.0,
      lng: -100.0
    };
    component.onAddressChange(addr);
    expect(component.form.value.fullAddress).toBe('Nueva Dir');
    expect(component.form.value.lat).toBe(20.0);
  });
});
