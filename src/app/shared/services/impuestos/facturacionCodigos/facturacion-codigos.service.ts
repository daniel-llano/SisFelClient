import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacturacionCodigosService {

  //Base para conexion proxy
  private baseUrl = '/api/FacturacionCodigos';

  constructor(private http : HttpClient) { }

  verificarNit(token : string, nit : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': token
    });
    
    let url = this.baseUrl + '/verificarNit';

    let solicitud = {
      codigoAmbiente: 2,
      codigoModalidad: 1,
      codigoSistema: "No requerido",
      codigoSucursal: 0, //Cargar Sucursal
      cuis: "No requerido",
      nit: 0,
      nitParaVerificacion: nit.trim()
    }
    return this.http.post(url, solicitud, {headers : httpHeaders});
  }

}
