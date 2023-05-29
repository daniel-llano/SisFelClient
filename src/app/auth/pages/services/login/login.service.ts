import { Login } from 'src/app/shared/models/login';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //Base para conexion proxy
  baseUrl = '/api/Login';
    login!:Login;

  constructor(private http : HttpClient) { }

  
  LoginUsuario(Usuario:string,Clave : string){
    var l= this.inicializarLogin();

    l.Usuario=Usuario;
    l.Clave=Clave;
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json'
    });

    let url = this.baseUrl + '/authenticate';

    return this.http.post( url,l,{headers : httpHeaders});
    //return this.http.get(url);
  }

  inicializarLogin():Login{
    let login : Login = {
      Usuario : '',
      Clave : '',
    }
    return login;
}

}