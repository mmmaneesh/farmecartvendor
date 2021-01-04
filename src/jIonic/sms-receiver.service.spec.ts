import { TestBed } from '@angular/core/testing';

import { SmsReceiverService } from './sms-receiver.service';

describe('SmsReceiverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmsReceiverService = TestBed.get(SmsReceiverService);
    expect(service).toBeTruthy();
  });
});
