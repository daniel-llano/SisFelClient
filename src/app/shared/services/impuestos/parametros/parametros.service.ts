import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  //Base para conexion proxy
  baseUrl = '/api/Parametro';

  constructor(private http : HttpClient) { }

  obtenerListaMotivosAnulacion(token : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/listaMotivosAnulacion';
    return this.http.get(url, {headers : httpHeaders});
  }

}
