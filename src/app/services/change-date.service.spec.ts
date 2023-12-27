import { TestBed } from '@angular/core/testing';

import { ChangeDateService } from './change-date.service';

describe('ChangeDateService', () => {
  let service: ChangeDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
