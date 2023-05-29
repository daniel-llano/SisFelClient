import { TestBed } from '@angular/core/testing';

import { ClientphoneService } from './clientphone.service';

describe('ClientphoneService', () => {
  let service: ClientphoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientphoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
