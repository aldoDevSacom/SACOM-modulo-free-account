import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Metricas } from './metricas';
import { MetricsMockService } from '../../../../core/services/metrics.mock.service';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { LineChart } from '../line-chart/line-chart';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('Metricas', () => {
  let component: Metricas;
  let fixture: ComponentFixture<Metricas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Metricas, LineChart],
      imports: [BaseChartDirective],
      providers: [
        MetricsMockService,
        BusinessMockService,
        provideCharts(withDefaultRegisterables())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Metricas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load metrics data on init', () => {
    expect(component.data.length).toBe(30);
    expect(component.totalClicks).toBeGreaterThan(0);
    expect(component.totalImpressions).toBeGreaterThan(0);
  });
});
