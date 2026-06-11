import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { of } from 'rxjs';
import { MiNegocio } from './mi-negocio';
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

describe('MiNegocio', () => {
  let component: MiNegocio;
  let fixture: ComponentFixture<MiNegocio>;
  let mockService: jasmine.SpyObj<BusinessMockService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('BusinessMockService', ['updateBusiness'], {
      businesses: signal([mockBusiness])
    });
    mockService.updateBusiness.and.returnValue(of(mockBusiness));

    await TestBed.configureTestingModule({
      declarations: [MiNegocio],
      providers: [{ provide: BusinessMockService, useValue: mockService }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiNegocio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load business on init', () => {
    expect(component.business).toEqual(mockBusiness);
  });

  it('should call updateBusiness and set saved flag on save', (done) => {
    component.onSave(mockBusiness);
    expect(mockService.updateBusiness).toHaveBeenCalledWith(mockBusiness.id, mockBusiness);
    setTimeout(() => {
      expect(component.saved).toBeTrue();
      done();
    }, 0);
  });
});
