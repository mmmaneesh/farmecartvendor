import { TestBed } from '@angular/core/testing';

import { OnesignalService } from './onesignal.service';

describe('OnesignalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnesignalService = TestBed.get(OnesignalService);
    expect(service).toBeTruthy();
  });
});
