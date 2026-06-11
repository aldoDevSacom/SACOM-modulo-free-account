import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BusinessDrawer } from './business-drawer';

describe('BusinessDrawer', () => {
  let component: BusinessDrawer;
  let fixture: ComponentFixture<BusinessDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessDrawer],
      imports: [ReactiveFormsModule, GoogleMapsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
