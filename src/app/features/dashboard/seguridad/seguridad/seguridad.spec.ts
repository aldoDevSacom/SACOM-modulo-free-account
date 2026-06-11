import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Seguridad } from './seguridad';
import { AuthMockService } from '../../../../core/services/auth.mock.service';
import { SharedModule } from '../../../../shared/shared.module';

describe('Seguridad', () => {
  let component: Seguridad;
  let fixture: ComponentFixture<Seguridad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Seguridad],
      imports: [ReactiveFormsModule, SharedModule],
      providers: [AuthMockService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Seguridad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form on init', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should show error when passwords do not match', () => {
    component.form.setValue({
      currentPassword: 'OldPass1',
      newPassword: 'NewPass1',
      confirmPassword: 'Different1'
    });
    expect(component.form.hasError('passwordMismatch')).toBeTrue();
  });

  it('should not submit when form is invalid', () => {
    const authService = TestBed.inject(AuthMockService);
    spyOn(authService.currentUser, 'set');
    component.onSubmit();
    expect(authService.currentUser.set).not.toHaveBeenCalled();
  });
});
