import { TestBed } from '@angular/core/testing';

import { Save4laterService } from './save4later.service';

describe('Save4laterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Save4laterService = TestBed.get(Save4laterService);
    expect(service).toBeTruthy();
  });
});
