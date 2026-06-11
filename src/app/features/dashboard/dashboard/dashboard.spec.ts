import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Dashboard } from './dashboard';
import { AuthMockService } from '../../../core/services/auth.mock.service';
import { BusinessMockService } from '../../../core/services/business.mock.service';
import { Header } from '../components/header/header';
import { NavLateral } from '../components/nav-lateral/nav-lateral';
import { NavInferior } from '../components/nav-inferior/nav-inferior';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dashboard, Header, NavLateral, NavInferior],
      imports: [RouterTestingModule],
      providers: [AuthMockService, BusinessMockService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
