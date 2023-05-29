import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { RegistroCompra } from 'src/app/shared/models/registrocompra';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  //Base para conexion proxy
  baseUrl = '/api/RegistroCompra';

  constructor(private http : HttpClient) { }

  agregar(token : string, registroCompra : RegistroCompra){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    return this.http.post( url, registroCompra, {headers : httpHeaders});
  }
}
