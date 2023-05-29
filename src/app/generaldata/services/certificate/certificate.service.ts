import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  //Base para conexion proxy
  baseUrl = '/api/General';
  baseUrlImpuestos = '/api/FacturacionCodigos';

  constructor(private http : HttpClient) { }

  obtenerDatosCertificado(token : string){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/datosCertificado';

    return this.http.get(url, {headers : httpHeaders});
  }

  revocarCertificado(token : string, certificado : string, razonRevocacion : string, fechaFinValidez : string){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrlImpuestos + '/notificaCertificadoRevocado';

    let solicitud : SolicitudRevocacionCertificado ={
      certificado : certificado,
      codigoAmbiente : 2,
      codigoSistema : "",
      cuis : "",
      fechaRevocacion : fechaFinValidez,
      fechaRevocacionSpecified : true,
      nit : "0",
      codigoSucursal : 0,
      razonRevocacion : razonRevocacion
    }

    return this.http.post(url, solicitud, {headers : httpHeaders});
  
  }


}

interface SolicitudRevocacionCertificado {
  cuis : string;
  codigoAmbiente : number;
  certificado : string;
  codigoSistema : string;
  nit : string;
  codigoSucursal: number;
  fechaRevocacion : string;
  fechaRevocacionSpecified: boolean;
  razonRevocacion : string;
}
