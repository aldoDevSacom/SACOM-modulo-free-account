import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { BusinessListCard } from './business-list-card';

describe('BusinessListCard', () => {
  let component: BusinessListCard;
  let fixture: ComponentFixture<BusinessListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessListCard],
      imports: [CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
