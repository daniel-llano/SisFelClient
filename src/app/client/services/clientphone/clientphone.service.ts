import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { TelefonoCliente } from 'src/app/shared/models/telefonocliente';
import { TelefonoClienteDto } from 'src/app/shared/dtos/telefonoclientedto';

@Injectable({
  providedIn: 'root'
})
export class ClientphoneService {

  //Base para conexion proxy
  baseUrl = '/api/TelefonoCliente';

  constructor(private http : HttpClient) { }

  obtenerLista(token : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista';
    return this.http.get( url, {headers : httpHeaders});
  }

  agregar(token : string, telefonoCliente : TelefonoCliente){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    let telefonoClienteDto = this.cargarDatosDto(telefonoCliente);
    return this.http.post( url, telefonoClienteDto, {headers : httpHeaders});
  }

  modificar(token : string, telefonoCliente : TelefonoCliente){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado';
    return this.http.put(url, telefonoCliente, {headers : httpHeaders});
  }

  cargarDatosDto(telefonoCliente : TelefonoCliente): TelefonoClienteDto{
    let telefonoClienteDto : TelefonoClienteDto = {
      codigotelefonocliente : telefonoCliente.codigotelefonocliente,
      codigocliente : telefonoCliente.codigocliente,
      codigotipodocumentoidentidad : telefonoCliente.codigotipodocumentoidentidad,
      nit : telefonoCliente.nit,
      ci : telefonoCliente.ci,
      complemento : telefonoCliente.complemento,
      razonsocial : telefonoCliente.razonsocial,
      email : telefonoCliente.email,
      telefono : telefonoCliente.telefono,
      activo : telefonoCliente.activo
    } 
    return telefonoClienteDto;
  }
}
