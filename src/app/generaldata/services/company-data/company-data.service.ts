import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class CompanyDataService {

  //Base para conexion proxy
  baseUrl = '/api/General';

  constructor(private http : HttpClient) { }

  
  obtenerLista(token : string){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista';

    return this.http.get(url, {headers : httpHeaders});
  }

}
