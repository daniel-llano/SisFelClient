import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PuntoDeVenta } from 'src/app/shared/models/punto-de-venta';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class PuntoventaService {

  baseUrl = '/api/PuntoVenta';

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

  agregar(token : string, puntoDeVenta : PuntoDeVenta){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    return this.http.post( url, puntoDeVenta, {headers : httpHeaders});
  }

  modificar(token : string, puntoDeVenta : PuntoDeVenta){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';
    return this.http.put(url, puntoDeVenta, {headers : httpHeaders});
  }

  eliminar(token : string, codigopuntoventa : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoPuntoVenta=' + codigopuntoventa + '&estado=' + false;
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  habilitar(token : string, codigopuntoventa : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoPuntoVenta=' + codigopuntoventa + '&estado=' + true;
    return this.http.put(url, 1, {headers : httpHeaders});
  }
}
