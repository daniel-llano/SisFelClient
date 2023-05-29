import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacturacionTelecomControllerService {

  //Base para conexion proxy
  private baseUrl = '/api/FacturacionTelecom';

  constructor(private http : HttpClient) { }

  anularFactura(token : string, codigoPuntoVenta: number, cuf: string, codigoMotivo: number){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': token
    });

    let url = this.baseUrl + '/anulacionFactura' + '?codigoPuntoVenta'+ codigoPuntoVenta;

    let solicitudAnulacion = {
      codigoAmbiente: 2,
      codigoDocumentoSector: 22,
      codigoEmision: 1,
      codigoModalidad: 1,
      codigoPuntoVenta: codigoPuntoVenta,
      codigoPuntoVentaSpecified: true,
      codigoSistema: "No requerido",
      codigoSucursal: 0, // Cargar Sucursal
      cufd: "No requerido",
      cuis: "No requerido",
      nit: 0,
      tipoFacturaDocumento: 1,
      codigoMotivo: codigoMotivo,
      cuf: cuf
    }

    return this.http.post(url, solicitudAnulacion);
  }

  verificarEstadoFactura(token : string,codigoPuntoVenta: number, cuf: string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': token
    });
    
    let url = this.baseUrl + '/verificacionEstadoFactura' + '?codigoPuntoVenta='+ codigoPuntoVenta;

    let solicitud = {
      codigoAmbiente: 2, // Ajustar
      codigoDocumentoSector: 22,
      codigoEmision: 1,
      codigoModalidad: 1,
      codigoPuntoVenta: codigoPuntoVenta,
      codigoPuntoVentaSpecified: true,
      codigoSistema: "No requerido",
      codigoSucursal: 0,
      cufd: "No requerido",
      cuis: "No requerido",
      nit: 0,
      tipoFacturaDocumento: 1,
      cuf :  cuf
    }

    return this.http.post(url, solicitud, {headers : httpHeaders});
  }

  validacionRecepcionMasiva(token : string, codigoRecepcion: string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': token
    });

    let codigoPuntoVenta = 0;// Todas las emisiones masivas deberian ser desde el punto venta  0
    
    let url = this.baseUrl + '/validacionRecepcionMasivaFactura' + '?codigoPuntoVenta='+ codigoPuntoVenta;

    let solicitud = {
      codigoAmbiente: 2,
      codigoDocumentoSector: 22,
      codigoEmision: 3,
      codigoModalidad: 1,
      codigoPuntoVenta: codigoPuntoVenta,
      codigoPuntoVentaSpecified: true,
      codigoSistema: "No requerido",
      codigoSucursal: 0,
      cufd: "No requerido",
      cuis: "No requerido",
      nit: 0,
      tipoFacturaDocumento: 1,
      codigoRecepcion: codigoRecepcion
    }

    return this.http.post(url, solicitud, {headers : httpHeaders});
  }
}
