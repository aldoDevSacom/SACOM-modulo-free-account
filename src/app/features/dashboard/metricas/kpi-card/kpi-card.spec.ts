import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';

import { KpiCard } from './kpi-card';

describe('KpiCard', () => {
  let component: KpiCard;
  let fixture: ComponentFixture<KpiCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpiCard],
      providers: [DecimalPipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formats numeric value with thousands separators', () => {
    component.value = 1234;
    expect(component.displayValue).toBe('1,234');
  });

  it('passes string value through unchanged', () => {
    component.value = '3.5%';
    expect(component.displayValue).toBe('3.5%');
  });
});
