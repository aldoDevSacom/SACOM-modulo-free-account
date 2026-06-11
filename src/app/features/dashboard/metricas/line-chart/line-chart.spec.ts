import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChart } from './line-chart';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('LineChart', () => {
  let component: LineChart;
  let fixture: ComponentFixture<LineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineChart],
      imports: [BaseChartDirective],
      providers: [provideCharts(withDefaultRegisterables())]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build chartData when data is provided', () => {
    component.data = [
      { date: '2024-01-15', clicks: 50, impressions: 200 },
      { date: '2024-01-16', clicks: 75, impressions: 300 }
    ];
    component.ngOnChanges();
    expect(component.chartData.labels).toEqual(['15/01', '16/01']);
    expect(component.chartData.datasets[0].data).toEqual([50, 75]);
    expect(component.chartData.datasets[1].data).toEqual([200, 300]);
  });
});
