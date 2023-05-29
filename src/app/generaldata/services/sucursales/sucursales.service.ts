import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sucursal } from 'src/app/shared/models/sucursal';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  //Base para conexion proxy
  baseUrl = '/api/Sucursal';

  constructor(private http : HttpClient, private PaginacionService : PaginacionService) { }

  obtenerLista(token : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista';
    return this.http.get( url, {headers : httpHeaders});
  }

  listaPaginada(token:string, filtroEstado : boolean){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let url = this.baseUrl + '/listaPaginada' + '?filter=' + this.PaginacionService.Filtro.filter +
    '&PageSize=' + this.PaginacionService.Filtro.PageSize +
    '&PageNumber=' + this.PaginacionService.Filtro.PageNumber +
    '&activo=' + filtroEstado;
    return this.http.get( url,{headers : httpHeaders});
  }

  agregar(token : string, sucursal : Sucursal){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    return this.http.post( url, sucursal, {headers : httpHeaders});
  }

  modificar(token : string, sucursal : Sucursal){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';
    return this.http.put(url, sucursal, {headers : httpHeaders});
  }

  eliminar(token : string, codigoCliente : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoSucursal=' + codigoCliente + '&estado=' + false;
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  habilitar(token : string, codigoCliente : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoSucursal=' + codigoCliente + '&estado=' + true;
    return this.http.put(url, 1, {headers : httpHeaders});
  }
}
