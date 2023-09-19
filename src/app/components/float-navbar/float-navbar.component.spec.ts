import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatNavbarComponent } from './float-navbar.component';

describe('FloatNavbarComponent', () => {
  let component: FloatNavbarComponent;
  let fixture: ComponentFixture<FloatNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
