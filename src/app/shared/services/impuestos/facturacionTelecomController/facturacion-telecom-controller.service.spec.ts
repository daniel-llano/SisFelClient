import { TestBed } from '@angular/core/testing';

import { FacturacionTelecomControllerService } from './facturacion-telecom-controller.service';

describe('FacturacionTelecomControllerService', () => {
  let service: FacturacionTelecomControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturacionTelecomControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
