import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavLateral } from './nav-lateral';

describe('NavLateral', () => {
  let component: NavLateral;
  let fixture: ComponentFixture<NavLateral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavLateral],
      imports: [RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavLateral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
