
import { Component, OnInit } from '@angular/core';

//PrimeNG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//Services
import { UsersService } from './../../services/users/users.service';
import { RolesService } from '../../services/roles/roles.service';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

//Models 
import { Rol } from 'src/app/shared/models/rol';
import { Users } from 'src/app/shared/models/User/Users';
import { UserDto } from 'src/app/shared/models/User/UserDto';
import { PuntoDeVenta } from 'src/app/shared/models/punto-de-venta';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})
export class UsersManagementComponent implements OnInit {

  ventanaModal!: boolean;
  ventanaModalSesion!: boolean;
  estaEditando:boolean=false;
  intentoGuardar: boolean = false;
  intentoGuardarSesion: boolean = false;

  listadeRoles!:any [];
  listausers!:any[];
  listaPuntosVenta!:any[];
  listaPuntosVentaUsuario!: PuntoDeVenta[];

  usuarios!:UserDto[];
  user : UserDto = {
    nombreusuario : '',
    ci : '',
    nombres : '',
    ap : '',
    am : '',
    telefono : '',
    clave : '',
    codigorol:0,
    activo : true
  }

  //variables para la paginacion
  metadata : any;
  total = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 5;
  pageIndex : number = 0;
  filtro = "";
  filtroEstado : boolean = true;

  // Variables generales
  token! : string;
  
  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor(
    private rolesService:RolesService,
    private usersService:UsersService,
    private PaginacionService: PaginacionService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.PaginacionService.Filtro.filter = '';
    this.PaginacionService.Filtro.PageSize = 5;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.primengConfig.ripple = true;
    
    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
    }

    if(this.token!= null){
      this.cargarListas();
    }
  }

  cargarListas(){
    this.cargarListaRoles();
    this.cargarListaUsuarios();
    this.cargarListaPuntosVenta();
  }

  cargarListaUsuarios(){
      this.usersService.listaPaginada(this.token, this.filtroEstado).subscribe((lista : any) => {
      this.listausers = lista.data as Users[];
      this.metadata = lista.meta;
      this.total = this.metadata.totalCount;
      this.pageSize = this.metadata.pageSize;
    });
  }

  cargarListaRoles(){
    this.rolesService.obtenerLista(this.token, true).subscribe(lista => {
      this.listadeRoles=lista as Rol[];
    }); 
  }

  cargarListaPuntosVenta(){
    // Actualizar esta llamada al servicio creado en el modulo puntosVenta
    this.usersService.obtenerListaPuntosVenta(this.token).subscribe(lista => {
      this.listaPuntosVenta = lista as any;
    })
  }

  cargarListaPuntosVentaUsuario(){
    this.usersService.obtenerListaPuntosVentaUsuario(this.token, this.user.nombreusuario).subscribe(lista => {
      this.listaPuntosVentaUsuario = lista as PuntoDeVenta[];
    })
  }

  abrirModalNuevoDato() {
    this.user = this.inicializarUsuario();
    this.intentoGuardar = false;
    this.ventanaModal = true;
    this.estaEditando=false;
  }

  abriModalEditarDato(xuser : UserDto) {
    this.intentoGuardar = false;
    this.user = {...xuser}
    this.ventanaModal = true;
    this.estaEditando = true;
    this.cargarListaPuntosVentaUsuario();
  }

  abriModalEditarDatosSesion(nombreusuario: string) {
    this.intentoGuardarSesion = false;
    this.user.nombreusuario = nombreusuario;
    this.user.clave = "";
    this.ventanaModalSesion = true;
  }

  abrirModalEliminarDato(user: UserDto) {
    this.confirmationService.confirm({
      message: '¿Está seguro que quiere eliminar el usuario ' + user.nombreusuario + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : 'Si',
      accept: () => {
        this.usersService.eliminar(this.token,user.nombreusuario).subscribe(data => {
          this.cargarListaUsuarios();
        });
        this.user = this.inicializarUsuario();
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Usuario Deshabilitado', life: 3000});
      }
  });
  }

  abrirModalHabilitarDato(user: UserDto) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere habilitar el usuario ' + user.nombreusuario + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.usersService.habilitar(this.token,user.nombreusuario).subscribe(data => {
            this.cargarListaUsuarios();
          });
          this.user = this.inicializarUsuario();
          this.messageService.add({severity:'success', summary: 'Exito', detail: 'Usuario Habilitado', life: 3000});
        }
    });
  }

  ocultarModalSesion() {
    this.ventanaModalSesion = false;
    this.intentoGuardarSesion = false;
  }

  ocultarModalDetalle() {
    this.ventanaModal = false;
    this.intentoGuardar = false;
    this.estaEditando=false;
  }

  guardarDatos() {
    this.intentoGuardar = true;
    if(!this.validarDatos()){
      return false;
    }else{
      let indiceElemento = this.findIndexById(this.user.nombreusuario);
      if (indiceElemento != -1) {

        // Eliminando puntos de venta del usuario
        this.usersService.eliminarPuntoVentaUsuario(this.token, this.user.nombreusuario).subscribe(correcto=> {
        },error => {
          console.log("E:"+error.message);
          this.messageService.add({severity:'error', summary: 'ERROR', detail: 'OCURRIO UN ERROR AL ACTUALIZAR LOS PUNTOS DE VENTA DEL USUARIO POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE', life: 3000});
        })

        // Modificando usuario
        this.usersService.modificar(this.token,this.user).subscribe(data => {
          // Agregando puntos de venta del usuario
          this.agregarPuntosVentaUsuario()
          this.cargarListaUsuarios();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'USUARIO ACTUALIZADO', life: 3000});
          this.ocultarModalDetalle();
          this.user = this.inicializarUsuario();
        }, error =>{
          console.log("E:"+error.message)
          this.messageService.add({severity:'error', summary: 'ERROR', detail: 'OCURRIO UN ERROR AL ACTUALIZAR EL USUARIO POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE', life: 3000});
        });        

        
      }
      else {
          this.usersService.agregar(this.token,this.user).subscribe(data =>{
            // Agregando puntos de venta del usuario
            this.agregarPuntosVentaUsuario();
            this.cargarListaUsuarios();
            this.messageService.add({severity:'success', summary: 'EXITO', detail: 'USUARIO GUARDADO', life: 3000});
            this.ocultarModalDetalle();
            this.user = this.inicializarUsuario();
          }, error =>{
            console.log("E:"+error.message)
            this.messageService.add({severity:'error', summary: 'ERROR', detail: 'OCURRIO UN ERROR AL GUARDAR EL USUARIO POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE', life: 3000});
          })  
          
          
      }
      return true;
    }
  }

  actualizarContrasenia(){
    this.intentoGuardarSesion = true;
    if(this.validarDatosSesion()){
      this.usersService.actualizarContrasenia(this.token, this.user.nombreusuario, this.user.clave ).subscribe( respuesta=>{
        this.cargarListaUsuarios();
        this.messageService.add({severity:'success', summary: 'EXITO', detail: 'CONTRASEÑA DE USUARIO ACTUALIZADA', life: 3000});
        this.ocultarModalSesion();
        this.user = this.inicializarUsuario();
      }, error =>{
        console.log("E:"+error.message)
        this.messageService.add({severity:'error', summary: 'ERROR', detail: 'OCURRIO UN ERROR AL ACTUALIZAR LA CONTRASEÑA USUARIO, POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE', life: 3000});
      })
    }
    
  }

  inicializarUsuario():UserDto{
    let user : UserDto = {
      nombreusuario : '',
      ci : '',
      nombres : '',
      ap : '',
      am : '',
      telefono : '',
      clave : '',
      codigorol:0,
      activo : true
    }
    return user;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listausers.length; i++) {
        if (this.listausers[i].nombreusuario === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  validarDatos():boolean{
    return this.validarNombreUsuario() && this.validarCi() && this.validarNombres() && this.validarApellidos() && this.validarTelefono() && this.validarClave();
  }

  validarNombreUsuario(): boolean {
    let nombreusuario = this.user.nombreusuario.trim();
    return !(nombreusuario.length < 3 || nombreusuario.length >30)
  }

  validarCi():boolean {
    this.user.ci = this.user.ci.trim();
    return !(this.user.ci.length < 5 || this.user.ci.length > 15);
  }

  validarNombres() : boolean{
    this.user.nombres = this.user.nombres.trim();
    return !(this.user.nombres.length < 3 || this.user.nombres.length > 40);
  }

  validarApellidos() : boolean {
    this.user.ap = this.user.ap.trim();
    this.user.am = this.user.am.trim();
    return this.validarApellido(this.user.ap) || this.validarApellido(this.user.am);
  }

  validarApellido(apellido : string) : boolean {
    return !(apellido.length < 3 || apellido.length>30);
  }

  validarTelefono() : boolean {
    this.user.telefono = this.user.telefono.trim();
    return !(this.user.telefono.length < 7 || this.user.telefono.length > 40); 
  }

  validarClave() : boolean {
    return !(this.user.clave.length < 5 || this.user.clave.length > 64);
  }

  validarDatosSesion() : boolean {
    return this.validarNombreUsuario() && this.validarClave();
  }

  agregarPuntosVentaUsuario() {
    this.listaPuntosVentaUsuario.forEach( (puntoDeVenta : PuntoDeVenta) => {
      this.usersService.agregarPuntoVentaUsuario(this.token, this.user.nombreusuario, puntoDeVenta.codigopuntoventa).subscribe(respuesta =>{},error =>{
        console.log("E:"+error.message);
      })
    });
  }

  //Para paginación y filtrado
  paginate(event:any) {
    this.pageIndex=event.first ;
    this.PaginacionService.Filtro.PageNumber=event.page+1;
    this.PaginacionService.Filtro.PageSize=event.rows;
    this.cargarListaUsuarios();
  }

  filtrar() {
    this.pageIndex = 0;
    this.PaginacionService.Filtro.filter = this.filtro;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.PaginacionService.Filtro.PageSize = 5;
    this.cargarListaUsuarios();
  }

}
