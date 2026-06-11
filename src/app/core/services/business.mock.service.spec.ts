import { TestBed } from '@angular/core/testing';
import { BusinessMockService } from './business.mock.service';

describe('BusinessMockService', () => {
  let service: BusinessMockService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessMockService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('getBusiness() returns the mock seed business', (done) => {
    service.getBusiness().subscribe(biz => {
      expect(biz.businessName).toBe('Taquería El Buen Sabor');
      done();
    });
  });

  it('updateBusiness() updates the signal and persists to sessionStorage', (done) => {
    service.updateBusiness({ businessName: 'Nuevo Nombre' }).subscribe(biz => {
      expect(biz.businessName).toBe('Nuevo Nombre');
      expect(service.business().businessName).toBe('Nuevo Nombre');
      const stored = JSON.parse(sessionStorage.getItem('sa_business')!);
      expect(stored.businessName).toBe('Nuevo Nombre');
      done();
    });
  });

  it('uploadLogo() converts File to base64 string', (done) => {
    const file = new File(['dummy'], 'logo.png', { type: 'image/png' });
    service.uploadLogo(file).subscribe(result => {
      expect(result).toContain('data:image/png;base64,');
      done();
    });
  });
});
