import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  //Base para conexion proxy
  baseUrl = '/api/Categoria';

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
