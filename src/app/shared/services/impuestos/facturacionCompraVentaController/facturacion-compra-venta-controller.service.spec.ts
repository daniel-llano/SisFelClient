import { TestBed } from '@angular/core/testing';

import { FacturacionCompraVentaControllerService } from './facturacion-compra-venta-controller.service';

describe('FacturacionCompraVentaControllerService', () => {
  let service: FacturacionCompraVentaControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturacionCompraVentaControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
