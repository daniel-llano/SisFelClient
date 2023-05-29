import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente';
import { ClienteDto } from 'src/app/shared/models/Dtos/clientDto';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  //Base para conexion proxy
  baseUrl = '/api/Cliente';

  constructor(private http : HttpClient, private PaginacionService : PaginacionService) { }

  obtenerLista(token : string, filtroEstadoCliente: string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista?activo='+ filtroEstadoCliente;
    return this.http.get( url, {headers : httpHeaders});
  }

  listaPaginada(token:string, filtroEstadoCliente : boolean){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let url = this.baseUrl + '/listaPaginada'+'?filter='+this.PaginacionService.Filtro.filter+
    '&PageSize='+this.PaginacionService.Filtro.PageSize+
    '&PageNumber='+this.PaginacionService.Filtro.PageNumber+
    '&activo='+filtroEstadoCliente;
    return this.http.get( url,{headers : httpHeaders});
  }

  agregar(token : string, cliente : Cliente){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    let clienteDto : ClienteDto = this.cargarDatosDto(cliente);
    return this.http.post( url, clienteDto, {headers : httpHeaders});
  }

  modificar(token : string, cliente : Cliente){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';
    let clienteDto : ClienteDto = this.cargarDatosDto(cliente);
    return this.http.put(url, clienteDto, {headers : httpHeaders});
  }

  eliminar(token : string, codigoCliente : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoCliente=' + codigoCliente + '&estado=' + false;
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  habilitar(token : string, codigoCliente : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoCliente=' + codigoCliente + '&estado=' + true;
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  cargarDatosDto(cliente : Cliente) : ClienteDto{
    let clienteDto : ClienteDto = {
      codigocliente : cliente.codigocliente,
      ci : cliente.ci,
      datoscliente : cliente.datoscliente,
      tipopersona : cliente.tipopersona,
      activo : cliente.activo
    }
    return clienteDto;
  }
}
