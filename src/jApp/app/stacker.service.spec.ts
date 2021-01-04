import { TestBed } from '@angular/core/testing';

import { StackerService } from './stacker.service';

describe('StackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StackerService = TestBed.get(StackerService);
    expect(service).toBeTruthy();
  });
});
