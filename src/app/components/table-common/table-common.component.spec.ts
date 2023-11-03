import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCommonComponent } from './table-common.component';

describe('TableCommonComponent', () => {
  let component: TableCommonComponent;
  let fixture: ComponentFixture<TableCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
