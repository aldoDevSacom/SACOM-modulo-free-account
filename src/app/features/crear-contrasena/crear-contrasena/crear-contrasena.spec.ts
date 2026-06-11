import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CrearContrasena } from './crear-contrasena';
import { AuthMockService } from '../../../core/services/auth.mock.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CrearContrasena', () => {
  let component: CrearContrasena;
  let fixture: ComponentFixture<CrearContrasena>;

  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  const mockActivatedRoute = {
    snapshot: { queryParamMap: { get: (key: string) => 'test@example.com' } }
  };
  const mockAuthService = { setPassword: jasmine.createSpy('setPassword').and.returnValue(of(void 0)) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearContrasena],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthMockService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearContrasena);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
