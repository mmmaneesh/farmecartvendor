import { TestBed } from '@angular/core/testing';

import { DeliveryappService } from './deliveryapp.service';

describe('DeliveryappService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryappService = TestBed.get(DeliveryappService);
    expect(service).toBeTruthy();
  });
});
