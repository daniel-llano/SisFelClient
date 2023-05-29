import { Rol } from './../../../shared/models/rol';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Permiso } from 'src/app/shared/models/permiso';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  //Base para conexion proxy
  baseUrl = '/api/Rol';
  baseUrlEnlace = '/api/Enlace';
  baseUrlPermiso = '/api/Permiso';
  baseUrlUsuario = '/api/Usuario';

  constructor(private http : HttpClient, private PaginacionService : PaginacionService) { }

  
  obtenerLista(token : string, filtroEstadoRol : boolean){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista?activo='+ filtroEstadoRol;
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

  obtenerEnlaces(token : string){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrlEnlace + '/lista';
    return this.http.get( url, {headers : httpHeaders});

  }


  obtenerPermisos(token : string, codigoRol : number){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrlPermiso+ '/id'+ '?codigoRol=' + codigoRol;
    return this.http.get( url, {headers : httpHeaders});

  }

  agregar(token : string, rol : Rol){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';

    //Llamada API enviando el token
    return this.http.post( url, rol, {headers : httpHeaders});
  }

  agregarPermisos(token : string, permiso : Permiso){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrlPermiso + '/agregar';

    //Llamada API enviando el token
    return this.http.post( url, permiso, {headers : httpHeaders});
  }

  GetUserRol(token: string,codigoRol:number){
  //Cargando token JWT
  const httpHeaders = new HttpHeaders({
  'Content-type' : 'application/json',
  'Authorization': `Bearer ${token}`
  });

  let url = this.baseUrlUsuario + '/GetUserRol' + '?codigoRol=' + codigoRol;
  return this.http.get( url,{headers : httpHeaders});
  }

  modificar(token : string, rol : Rol){

    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';

    let Rol : Rol = this.cargarDatosRol(rol);

    //Llamada API enviando el token
    return this.http.put( url, rol, {headers : httpHeaders});
  }

  eliminarPermiso(token : string, codigoRol : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrlPermiso + '/eliminar' + '?Codigorol=' + codigoRol;
  

    //Llamada API enviando el token
    return this.http.delete( url, {headers : httpHeaders});
  }

  cargarDatosRol(rol : Rol) : Rol{
    let Rol : Rol = {
      codigorol : rol.codigorol,
      nombrerol : rol.nombrerol,
      descripcion : rol.descripcion,
      activo : rol.activo
    }
    return Rol;
  }



  eliminar(token : string, CodigoRol : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    let url = this.baseUrl + '/cambio de estado' + '?Codigorol=' + CodigoRol +'&estado=' + false ;
    //Llamada API enviando el token
    return this.http.put( url, 1, {headers : httpHeaders}
      );
  }

  habilitar(token : string, CodigoRol : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?Codigorol=' + CodigoRol+ '&estado=' + true;

    //Llamada API enviando el token
    return this.http.put( url,1, {headers : httpHeaders});
  }

}