import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

//PRIME NG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

//SERVICIO
import { RolesService } from 'src/app/manage/services/roles/roles.service';
import { Enlace } from '../models/enlace';
import { UsersService } from 'src/app/manage/services/users/users.service';
import { PuntoDeVenta } from '../models/punto-de-venta';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})
export class HeaderComponent implements OnInit {

    prueba=false;
    token! : string;
    codigoRol! : number;
    usuario = '';
    enlaces:number[]=[];
    listaenlaces:any[]=[];
    rutas:string[]=['','/administrar/usuarios','/administrar/roles','/general/unidades','/general/categorias','/general/empresa','/productos/gestion','/clientes/lista','/facturacion/gestion',
    '/facturacion/pendientes','/facturacion/individual','/facturacion/masiva','/eventos/gestion','/general/certificado','/general/sucursales','/general/puntos_de_venta'];
    items:any[]=[];
    rutasuno:string[]=['','','','','','','','','','','','','','',''];

    listaPuntosVenta = [];
    puntoVenta : PuntoDeVenta = {
        codigopuntoventa: -1,
        nombrepuntoventa: '',
        tipopuntoventa: '',
        codigosucursal: -1,
        activo : true
    }

    private datosLocalStorage = {
        tk: '',
        nu: '',
        cr: -1,
        cpdv : -1,
        cs: -1
    }

  constructor(
    private usersService : UsersService,
    private rolesService:RolesService,
    private primengConfig: PrimeNGConfig) { }


  ngOnInit():void {
    this.primengConfig.ripple = true;
    
    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
        this.codigoRol = this.datosLocalStorage.cr as number;
        this.usuario = this.datosLocalStorage.nu; 
        this.puntoVenta.codigosucursal = this.datosLocalStorage.cs;
        this.puntoVenta.codigopuntoventa = this.datosLocalStorage.cpdv;
    }

    if(this.token!= null){
        this.obtenerPermisos();
        this.obtenerEnlaces();
        this.cargarListaPuntosVenta();
        this.items=[
            {
                label:'',
                icon:'',
                routerLink: "/logout",
            }
        ];   
    }else{
        this.items = [
            {
                label:'Iniciar Sesión',
                icon:'pi pi-fw pi-sign-in',
                routerLink: "/login",
            }
        ];
    }
  }

  cargarListaPuntosVenta(){
    // Actualizar esta llamada al servicio creado en el modulo puntosVenta
    this.usersService.obtenerListaPuntosVentaUsuario(this.token, this.usuario).subscribe(lista => {
      this.listaPuntosVenta = lista as any;
    })
  }

  obtenerPermisos(){
    this.rolesService.obtenerPermisos(this.token,this.codigoRol).subscribe((resp:any) => {
       resp.forEach((element : any) => {
        this.enlaces.push(element.codigoenlace);
       });    
    })
  }

  obtenerEnlaces(){
    this.rolesService.obtenerEnlaces(this.token).subscribe((resp:any) => {
        resp.forEach((element : any) => {
            this.enlaces.forEach((elementos : any) => {
                if(element.codigoenlace===elementos){
                    var obj : Enlace = {
                        codigoenlace:element.codigoenlace,
                        nombreenlace:element.nombreenlace,
                        ruta:element.ruta,
                        activo : element.activo
                      } 
                    this.listaenlaces.push(obj);
                    this.rutasuno[obj.codigoenlace]=obj.ruta;                 
                }
            });
        });
        this.mostrarItems(this.rutasuno);
    });
  }

  inicializarEnlaces():Enlace{
    var obj : Enlace = {
        codigoenlace:0,
        nombreenlace:'',
        ruta:'',
      activo : true
    }
    return obj;
  }

  mostrarItems(lista:any){
    this.rutas=lista;
    this.items = [
        {
            label:'Administrar',
            icon:'pi pi-fw pi-pencil',
            visible:this.mostrarItemsMenu(this.rutas[1]+this.rutas[2]),
            items:[
                {
                    label:'Usuarios',
                    icon:'pi pi-fw pi-user',
                    routerLink: this.rutas[1],
                    visible:this.mostrarItemsMenu(this.rutas[1])
                },
                {
                    label:'Roles',
                    icon:'pi pi-fw pi-id-card',
                    routerLink: this.rutas[2],
                    visible:this.mostrarItemsMenu(this.rutas[2])
                }
            ]
        },
        {
            label:'Datos Generales',
            icon:'pi pi-fw pi-database',
            visible:this.mostrarItemsMenu(this.rutas[3]+this.rutas[4]+this.rutas[5]+this.rutas[13]+this.rutas[14]+this.rutas[15]),
            items:[
                {
                    label:'Unidades',
                    icon:'pi pi-fw pi-percentage',
                    routerLink: this.rutas[3],
                    visible:this.mostrarItemsMenu(this.rutas[3])
                },
                {
                    label:'Categorias',
                    icon:'pi pi-fw pi-align-left',
                    routerLink: this.rutas[4],
                    visible:this.mostrarItemsMenu(this.rutas[4])
                },
                {
                    label:'Datos de la Empresa',
                    icon:'pi pi-fw pi-home',
                    routerLink: this.rutas[5],
                    visible:this.mostrarItemsMenu(this.rutas[5])
                },
                {
                    label:'Certificado',
                    icon:'pi pi-fw pi-key',
                    routerLink: this.rutas[13],
                    visible:this.mostrarItemsMenu(this.rutas[13])
                },
                {
                    label:'Sucursales',
                    icon:'pi pi-fw pi-building',
                    routerLink: this.rutas[14],
                    visible:this.mostrarItemsMenu(this.rutas[14])
                },
                {
                    label:'Puntos de Venta',
                    icon:'pi pi-fw pi-shopping-bag',
                    routerLink: this.rutas[15],
                    visible:this.mostrarItemsMenu(this.rutas[15])
                }
            ]
        },
        {
            label:'Datos Factura',
            icon:'pi pi-fw pi-file-edit',
            visible:this.mostrarItemsMenu(this.rutas[6]+this.rutas[7]),
            items:[
                {
                    label:'Productos',
                    icon:'pi pi-fw pi-shopping-cart',
                    routerLink: this.rutas[6],
                    visible:this.mostrarItemsMenu(this.rutas[6])
    
                },
                {
                    label:'Clientes',
                    icon:'pi pi-fw pi-user',
                    routerLink: this.rutas[7],
                    visible:this.mostrarItemsMenu(this.rutas[7])
    
                }
            ]
        },
        {
            label:'Facturas',
            icon:'pi pi-fw pi-folder',
            visible:this.mostrarItemsMenu(this.rutas[8]+this.rutas[9]),
            items:[
                {
                    label:'Gestión de facturas',
                    icon:'pi pi-fw pi-folder-open',
                    routerLink: this.rutas[8],
                    visible:this.mostrarItemsMenu(this.rutas[8])
    
                },
                {
                    label:'Facturas pendientes',
                    icon:'pi pi-fw pi-print',
                    routerLink: this.rutas[9],
                    visible:this.mostrarItemsMenu(this.rutas[9])
                }
            ]
        },
        {
            label:'Facturación',
            icon:'pi pi-fw pi-money-bill',
            visible:this.mostrarItemsMenu(this.rutas[10]+this.rutas[11]),
            items:[
                {
                    label:'Individual',
                    icon:'pi pi-fw pi-file',
                    routerLink: this.rutas[10],
                    visible:this.mostrarItemsMenu(this.rutas[10])
                },
                {
                    label:'Masiva',
                    icon:'pi pi-fw pi-briefcase',
                    routerLink: this.rutas[11],
                    visible:this.mostrarItemsMenu(this.rutas[11])
                },
            ]
          
        },
        
        {
            label:'Eventos Significativos',
            icon:'pi pi-fw pi-wrench',
            routerLink: this.rutas[12],
            visible:this.mostrarItemsMenu(this.rutas[12])
          },
        {
            label:'Salir',
            icon:'pi pi-fw pi-sign-out',
            routerLink: "/logout",
            visible:true
        },
      ];
    
  }

  mostrarItemsMenu(ruta:string){
    var visible=false;
    if(ruta===""){
        visible=false;
    }else{
        visible=true;
    }
    return visible;
  }

  actualizarPuntoVenta(event : Event){
    this.puntoVenta.codigosucursal = this.buscarSucursalDePuntoVenta();
    this.datosLocalStorage.cpdv = +this.puntoVenta.codigopuntoventa;
    this.datosLocalStorage.cs = +this.puntoVenta.codigosucursal;
    localStorage.setItem('dtls', JSON.stringify(this.datosLocalStorage));
  }  

  buscarSucursalDePuntoVenta() : number{
    let codigoSucursal = -1;
    this.listaPuntosVenta.forEach( (puntoVenta : any) =>{
        if(puntoVenta.codigopuntoventa == this.puntoVenta.codigopuntoventa){
            codigoSucursal = puntoVenta.codigosucursal;
        }      
    });
    return codigoSucursal;
  }
}
