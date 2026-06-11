import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavInferior } from './nav-inferior';

describe('NavInferior', () => {
  let component: NavInferior;
  let fixture: ComponentFixture<NavInferior>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavInferior],
      imports: [RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavInferior);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
