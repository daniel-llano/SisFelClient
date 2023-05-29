
import { Component, OnInit } from '@angular/core';

//MODEL
import { Rol } from './../../../shared/models/rol';
import { Enlace } from 'src/app/shared/models/enlace';
import { Permiso } from 'src/app/shared/models/permiso';

//PRIMENG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//SERVICIO
import { RolesService } from './../../services/roles/roles.service';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';


@Component({
  selector: 'app-roles-management',
  templateUrl: './roles-management.component.html',
  styleUrls: ['./roles-management.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})
export class RolesManagementComponent implements OnInit {

  puedeEditarCodigorol! : boolean;
  intentoGuardar!: boolean;
  ventanaModal!: boolean;

  rols! : Rol[];
  rol!: any;
  rolSeleccionados!: any;
  listaEnlaces! : Enlace[];
  selectedCategories: any[] = [];
  categories : Enlace[]=[];
  permisos!: Permiso[];
  resultado=false;

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
    private PaginacionService: PaginacionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, 
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit() {
    this.PaginacionService.Filtro.filter = '';
    this.PaginacionService.Filtro.PageSize = 5;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.primengConfig.ripple = true;

    this.primengConfig.ripple = true;
    
    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
    }

    if(this.token!= null){
      this.cargarLista();
      this.cargarEnlaces();
    }
  }

  capturarEnlaces(codigoRol: number){
    this.rolesService.obtenerPermisos(this.token,codigoRol).subscribe((lista:any) => {
      this.selectedCategories=[];
      lista.forEach((elementPermisos :any)=> {
        this.categories.forEach((elementEnlaces:any) => {
          if(elementPermisos.codigoenlace==elementEnlaces.codigoenlace){
            this.selectedCategories.push(elementPermisos.codigoenlace);
          }
        });
      });
    })
   
  }

  guardarPermisos(enlaces:any,codigorol:number){
    
    enlaces.forEach((element: any) => {
      var obj : Permiso= {
        codigorol : codigorol,
        codigoenlace : element,
        activo : true,
      }
      this.rolesService.agregarPermisos(this.token,obj).subscribe((datapermisos : any)=>{
       })
    });
  }


  cargarLista(){
      this.rolesService.listaPaginada(this.token, this.filtroEstado).subscribe((lista : any) => {
      this.rols = lista.data as Rol[];
      this.metadata = lista.meta;
      this.total=this.metadata.totalCount;
      this.pageSize=this.metadata.pageSize;
    })
  }

  cargarEnlaces(){
    this.rolesService.obtenerEnlaces(this.token).subscribe(lista => {
      this.categories = lista as Enlace[];
    })
  }

  abrirModalNuevoDato() {
    this.rol = {};
    this.intentoGuardar = false;
    this.ventanaModal = true;
  }


  abriModalEditarDato(roles: Rol) {
    this.rol = {...roles};
    this.rol.codigorol = this.rol.codigorol;
    this.puedeEditarCodigorol = false;
    this.capturarEnlaces(this.rol.codigorol);
    this.ventanaModal = true;
  }

  abrirModalHabilitarDato(rol: Rol) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere habilitar el usuario ' + rol.nombrerol + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.rolesService.habilitar(this.token,rol.codigorol).subscribe(data => {
            this.cargarLista();
          });
          this.rol = this.inicializarRol();
          this.messageService.add({severity:'success', summary: 'Exito', detail: 'Rol Habilitado', life: 3000});
        }
    });
  }

  abrirModalEliminarDato(rol: Rol) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere eliminar el rol ' + rol.nombrerol + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.rolesService.GetUserRol(this.token,rol.codigorol).subscribe((data:any) => {
          if(data.length>0){
            this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Antes de eliminar un rol debe deshabilitar los usuarios que esten con este rol asignado', life: 7000});
          }else{
            this.rolesService.eliminar(this.token,rol.codigorol).subscribe(datados => {
              this.cargarLista();
            });
            this.rol = this.inicializarRol();
            this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Rol Deshabilitado', life: 3000});
          }
          });
        }
    });
  }

  GetUserRol(codigoRol:number){
    
  
  }

  ocultarModal() {
    this.ventanaModal = false;
    this.intentoGuardar = false;
  }

  guardarDatos() {
    this.intentoGuardar = true;
    if(!this.validarDatos()){
      return false;
    }else{
      let indiceElemento = this.findIndexById(this.rol.codigorol);
        if (indiceElemento != -1) { 

          this.eliminarPermisos(this.rol.codigorol);
          this.rolesService.modificar(this.token,this.rol).subscribe((data : any)=> {
            this.guardarPermisos(this.selectedCategories,data.codigorol);
            this.cargarLista();
            this.messageService.add({severity:'success', summary: 'Exito', detail: 'Rol Actualizado', life: 3000});
          });    
      }

        else {
            this.rolesService.agregar(this.token,this.rol).subscribe((data : any)=>{
             this.guardarPermisos(this.selectedCategories,data.codigorol);
              this.cargarLista();

            })
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rol Guardado', life: 3000});
        }

       
        this.ventanaModal = false;
        this.rol = this.inicializarRol();
        return true;
    }
    
  }

  
  eliminarPermisos(codigoRol:number){
    this.rolesService.eliminarPermiso(this.token,codigoRol).subscribe((datapermisos : any)=>{
    })
  }


  validarDatos():boolean{
    if(this.rol.Codigorol == "" || this.rol.Nombrerol == ""|| this.rol.Descripcion == ""){
      return false;
    }else{
      return true;
    }
  }

  eliminarDatosSeleccionados() {
    this.confirmationService.confirm({
        message: '¿Está seguro de eliminar los roles selecionados?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.rols = this.rols.filter(val => !this.rolSeleccionados.includes(val));
            this.rolSeleccionados = null;
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Lista de Roles Eliminada', life: 3000});
        }
    });
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.rols.length; i++) {
        if (this.rols[i].codigorol === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  inicializarRol():Rol{
    let rol : Rol = {
      codigorol : 0,
      nombrerol : '',
      descripcion : '',
      activo : true
    }
    return rol;
  }

  inicializarPermiso():Permiso{
    let permiso : Permiso = {
      codigorol : 0,
      codigoenlace : 0,
      activo : true
    }
    return permiso;
  }

  //Para paginación y filtrado
  paginate(event:any) {
    this.pageIndex=event.first ;
    this.PaginacionService.Filtro.PageNumber=event.page+1;
    this.PaginacionService.Filtro.PageSize=event.rows;
    this.cargarLista();
  }

  filtrar() {
    this.pageIndex = 0;
    this.PaginacionService.Filtro.filter = this.filtro;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.PaginacionService.Filtro.PageSize = 5;
    this.cargarLista();
  }
  
}
