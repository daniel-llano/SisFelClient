import { TestBed } from '@angular/core/testing';

import { FacturacionCodigosService } from './facturacion-codigos.service';

describe('FacturacionCodigosService', () => {
  let service: FacturacionCodigosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturacionCodigosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
