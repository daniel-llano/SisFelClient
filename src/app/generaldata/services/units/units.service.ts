import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  //Base para conexion proxy
  baseUrl = '/api/Parametro';

  constructor(private http : HttpClient) { }

  obtenerLista(token : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/listaUnidadesMedida';
    return this.http.get(url, {headers : httpHeaders});
  }

  obtenerListaMotivosEvento(token : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/listaMotivoEvento';
    return this.http.get(url, {headers : httpHeaders});
  }

  

}
