import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Factura } from 'src/app/shared/models/factura';

// Observable
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  //Base para conexion proxy
  private baseUrl = '/api/Factura';

  private factura$ = new Subject<Factura>();

  constructor(private http : HttpClient) { }

  obtenerFactura$(): Observable<Factura>{
    return this.factura$.asObservable();
  }

  cargarFactura(xfactura: Factura){
    this.factura$.next(xfactura);
  }

  obtenerLista(token : string, filtroEstadoFactura : string){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista?estado=' + filtroEstadoFactura;

    return this.http.get(url, {headers : httpHeaders});

  }

  obtenerListaFacturasPendientes(token : string, codigoTelefonoCliente:string){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista?codigoTelefonoCliente=' + codigoTelefonoCliente;

    return this.http.get(url, {headers : httpHeaders});

  }

  anularFactura(token : string, codigoFactura : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoFactura=' + codigoFactura + '&estado=ANULADA';
    //Llamada API enviando el token
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  cancelarFactura(token : string, codigoFactura : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoFactura=' + codigoFactura + '&estado=CANCELADA';
    //Llamada API enviando el token
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  enviarArchivos(token : string, codigoFactura : number, correo: string){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/enviarArchivos' + '?codigoFactura=' + codigoFactura + '&correoReceptor=' + correo;
    //Llamada API enviando el token
    return this.http.post(url, 1, {headers : httpHeaders});
  }


}
