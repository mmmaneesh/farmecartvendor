import { TestBed } from '@angular/core/testing';

import { UpiService } from './upi.service';

describe('UpiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpiService = TestBed.get(UpiService);
    expect(service).toBeTruthy();
  });
});
