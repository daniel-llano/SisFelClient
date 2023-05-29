  import { Login } from './../../../shared/models/login';
import { Component, OnInit } from '@angular/core';

//ROUTEADOR
import { Router } from '@angular/router';

//PRIMENG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//SERVICIO
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})
export class LoginComponent implements OnInit {

  usuario : string ="";
  contrasenia : string ="";

  login : Login = {
    Usuario : '',
    Clave : ''
  }

  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor(private Router: Router,private loginService:LoginService,private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    localStorage.removeItem('dtls');
    this.primengConfig.ripple = true;    
    this.login = this.inicializarLogin();
  }

  loginUser(){
    this.loginService.LoginUsuario(this.login.Usuario,this.login.Clave).subscribe(response => { 
      if((response as any).token!=""){

        // Cargando datos en local storage
        this.datosLocalStorage.tk = (response as any).token;
        this.datosLocalStorage.cr = (response as any).codigorol;
        this.datosLocalStorage.nu = this.login.Usuario;
        localStorage.setItem('dtls', JSON.stringify(this.datosLocalStorage)); 

        this.messageService.add({severity:'success', summary: 'Exito', detail: 'Logueado Exitosamente', life: 2000});
        setTimeout(() => {
          this.Router.navigate(['/inicio']);
          setTimeout(() => {window.location.reload()},600);
        },600);
      }else{
        this.messageService.add({severity:'warn', summary: 'Exito', detail: 'Usuario invalido o contraseña incorrecta', life: 3000});
      }
      
    })
  }

  logout():void{
    this.primengConfig.ripple = true;
    this.login = this.inicializarLogin();
  }

  inicializarLogin():Login{    
    let login : Login = {
      Usuario: '',
      Clave: ''
    }
    return login;
  }
}