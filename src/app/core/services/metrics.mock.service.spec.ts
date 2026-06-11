import { TestBed } from '@angular/core/testing';
import { MetricsMockService } from './metrics.mock.service';

describe('MetricsMockService', () => {
  let service: MetricsMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricsMockService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('getMetrics() returns exactly 30 data points', (done) => {
    service.getMetrics('biz-001').subscribe(metrics => {
      expect(metrics.last30Days.length).toBe(30);
      done();
    });
  });

  it('each data point has date, clicks and impressions > 0', (done) => {
    service.getMetrics('biz-001').subscribe(metrics => {
      metrics.last30Days.forEach(point => {
        expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(point.clicks).toBeGreaterThan(0);
        expect(point.impressions).toBeGreaterThan(0);
      });
      done();
    });
  });

  it('getMetrics() returns same values on repeated calls (deterministic)', (done) => {
    service.getMetrics('biz-001').subscribe(first => {
      service.getMetrics('biz-001').subscribe(second => {
        expect(first.last30Days[0].clicks).toBe(second.last30Days[0].clicks);
        done();
      });
    });
  });
});
