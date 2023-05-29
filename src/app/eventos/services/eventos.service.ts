import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventoDto } from 'src/app/shared/models/Dtos/eventoDto';
import { Evento } from 'src/app/shared/models/eventos';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

   //Base para conexion proxy
   baseUrl = '/api/Evento';

   constructor(private http : HttpClient, private PaginacionService : PaginacionService) { }
 
   obtenerLista(token : string, filtroEstado : any){
 
     //Cargando token JWT
     const httpHeaders = new HttpHeaders({
       'Content-type' : 'application/json',
       'Authorization': `Bearer ${token}`
     });
     
     let url = this.baseUrl + '/lista?activo='+ filtroEstado;
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
 
   agregar(token : string, evento : Evento){
   
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    let eventoDto : EventoDto = this.cargarDatosDto(evento);
    return this.http.post( url, eventoDto, {headers : httpHeaders});
  }

  modificar(token : string, evento : Evento){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';
    let eventoDto : EventoDto = this.cargarDatosDto(evento);
    return this.http.put( url, eventoDto, {headers : httpHeaders});
  }

  activo(token : string, codigoevento : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/terminarEvento' + '?CodigoEvento=' + codigoevento + '&estado=' + true;
    return this.http.put( url, 1, {headers : httpHeaders});
  }

  detener(token : string, codigoevento : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/terminarEvento' + '?CodigoEvento=' + codigoevento + '&estado=' + false;
    return this.http.put( url, 1, {headers : httpHeaders});
  }

  cargarDatosDto(evento : Evento) : EventoDto{
    let eventoDto : EventoDto = {
      codigoevento: evento.codigoevento,
      codigomotivoevento: +evento.codigomotivoevento,
      codigorecepcionevento: evento.codigorecepcionevento,
      codigopuntoventa: evento.codigopuntoventa,
      cafccompraventa: evento.cafccompraventa,
      cafctelecom: evento.cafctelecom,
      cuis: evento.cuis,
      cufd: evento.cufd,
      cufdevento: evento.cufdevento,
      //cufdevento: evento.cufdevento,
      descripcion: evento.descripcion,
      fechahorainicioevento: evento.fechahorainicioevento,
      fechafinevento: evento.fechafinevento,
      activo: evento.activo
    }
    return eventoDto;
  }

}
