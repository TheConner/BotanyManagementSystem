import { TestBed } from '@angular/core/testing';

import { BMSService } from './bms.service';

describe('BMSService', () => {
  let service: BMSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BMSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
