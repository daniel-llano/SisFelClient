import { TestBed } from '@angular/core/testing';

import { MassInvoicesService } from './mass-invoices.service';

describe('MassInvoicesService', () => {
  let service: MassInvoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MassInvoicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
