import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { UserDto } from 'src/app/shared/models/User/UserDto';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //Base para conexion proxy
  baseUrl = '/api/Usuario';

  constructor(private http : HttpClient, private PaginacionService : PaginacionService) { }

  obtenerLista(token : string, filtroEstadoUsuario : any){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista?activo='+ filtroEstadoUsuario;
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

  agregar(token : string, user : UserDto){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    return this.http.post( url, user, {headers : httpHeaders});
  }

  modificar(token : string, user : UserDto){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';
    return this.http.put( url, user, {headers : httpHeaders});
  }

  eliminar(token : string, nombreusuario : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?Nombreusuario=' + nombreusuario +'&estado=' + false;
    return this.http.put( url, 1, {headers : httpHeaders});
  }

  habilitar(token : string, nombreusuario : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?Nombreusuario=' + nombreusuario+ '&estado=' + true;
    return this.http.put( url, 1, {headers : httpHeaders});
  }

  actualizarContrasenia(token : string, nombreusuario: string , nuevacontrasenia : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambioContrasenia' + '?Nombreusuario=' + nombreusuario+ '&nuevaContrasenia=' + nuevacontrasenia;
    return this.http.put( url, 1, {headers : httpHeaders});
  }

  obtenerListaPuntosVenta(token : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = 'api/PuntoVenta' + '/lista';
    return this.http.get( url, {headers : httpHeaders});
  }

  obtenerListaPuntosVentaUsuario(token : string, usuario : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = 'api/UsuarioPuntoVenta' + '/lista?nombreUsuario=' + usuario;
    return this.http.get( url, {headers : httpHeaders});
  }

  eliminarPuntoVentaUsuario(token : string, user : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = 'api/UsuarioPuntoVenta/eliminar?nombreUsuario=' + user;
    return this.http.delete( url, {headers : httpHeaders});
  }

  agregarPuntoVentaUsuario(token : string, nombreUsuario: string, codigoPuntoVenta: number){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let usuarioPuntoVenta = {
      nombreUsuario : nombreUsuario,
      codigoPuntoVenta : codigoPuntoVenta,
      activo : true
    }

    let url = 'api/UsuarioPuntoVenta/agregar';
    return this.http.post( url, usuarioPuntoVenta, {headers : httpHeaders});
  }

  
}