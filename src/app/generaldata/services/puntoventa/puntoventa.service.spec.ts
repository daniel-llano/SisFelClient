import { TestBed } from '@angular/core/testing';

import { PuntoventaService } from './puntoventa.service';

describe('PuntoventaService', () => {
  let service: PuntoventaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntoventaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
