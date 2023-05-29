import { Component, OnInit } from '@angular/core';

//PrimeNG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//Models
import { PuntoDeVenta } from 'src/app/shared/models/punto-de-venta';
import { Sucursal } from './../../../shared/models/sucursal';

//Services
import { PuntoventaService } from '../../services/puntoventa/puntoventa.service';
import { SucursalesService } from '../../services/sucursales/sucursales.service';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Component({
  selector: 'app-puntoventa',
  templateUrl: './puntoventa.component.html',
  styleUrls: ['./puntoventa.component.css'],
  styles: [` 
      :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})
export class PuntoventaComponent implements OnInit {

  listaPuntoVenta! : PuntoDeVenta[];
  listaSucursales! : any [];

  puntoDeVenta : PuntoDeVenta = {
    codigopuntoventa : 0,
    nombrepuntoventa : '',
    tipopuntoventa : '',
    codigosucursal : 0,
    activo : true
  }

  guardar! : boolean;
  modal! : boolean;
  editar! : boolean;

  //variables para la paginacion
  metadata : any;
  total = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 5;
  pageIndex : number = 0;
  filtro = "";
  filtroEstado : boolean = true;

  // Datos Generales
  token! : string;
  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor(
    private puntoventaService: PuntoventaService,
    private sucursalService: SucursalesService,
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
    this.cargarlistaPuntoVenta();
    this.cargarListaSucursales();
  }

  cargarlistaPuntoVenta(){
      this.puntoventaService.listaPaginada(this.token, this.filtroEstado).subscribe((lista : any) => {
      this.listaPuntoVenta = lista.data as PuntoDeVenta[];
      this.metadata = lista.meta;
      this.total = this.metadata.totalCount;
      this.pageSize = this.metadata.pageSize;
    });
  }

  cargarListaSucursales(){
    this.sucursalService.obtenerLista(this.token).subscribe(lista => {
      this.listaSucursales = lista as Sucursal[];
    }); 
  }

  inicializarPuntoDeVenta(): PuntoDeVenta{
    let puntoDeVenta : PuntoDeVenta = {
      codigopuntoventa : 0,
      nombrepuntoventa : '',
      tipopuntoventa : '',
      codigosucursal : 0,
      activo : true
    }
    return puntoDeVenta;
  }
  
  modalAgregar() {
    this.puntoDeVenta = this.inicializarPuntoDeVenta();
    this.editar = true;
    this.guardar = false;
    this.modal = true;
  }

  modalEditar(puntoDeVenta: PuntoDeVenta) {
    this.puntoDeVenta = {...puntoDeVenta};
    this.editar = false;
    this.guardar = false;
    this.modal = true;
  }

  modalEliminar(puntoDeVenta: PuntoDeVenta) {
    this.confirmationService.confirm({
      message: '¿Está seguro que quiere eliminar el punto de venta? ' + puntoDeVenta.codigopuntoventa + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : 'Si',
      accept: () => {
        this.puntoventaService.eliminar(this.token, puntoDeVenta.codigopuntoventa.toString()).subscribe(data => {
          this.cargarlistaPuntoVenta();
        });
        this.puntoDeVenta = this.inicializarPuntoDeVenta();
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Punto de venta Deshabilitado', life: 3000});
      }
    });
  }

  modalHabilitar(puntoDeVenta: PuntoDeVenta) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere habilitar el Punto de Venta ' + puntoDeVenta.codigopuntoventa + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.puntoventaService.habilitar(this.token, puntoDeVenta.codigopuntoventa.toString()).subscribe(data => {
            this.cargarlistaPuntoVenta();
          });
          this.puntoDeVenta = this.inicializarPuntoDeVenta();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'PUNTO DE VENTA HABILITADO', life: 3000});
        }
    });
  }

  ocultarModal() {
    this.modal = false;
    this.guardar = false;
  }

  guardarDatos() {
    this.guardar = true;

    console.log(this.puntoDeVenta)
      let indiceElemento = this.buscarPorId(this.puntoDeVenta.codigopuntoventa.toString());
      if (indiceElemento != -1) {
        this.puntoventaService.modificar(this.token,this.puntoDeVenta).subscribe(data => {
          this.cargarlistaPuntoVenta();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'PUNTO DE VENTA ACTUALIZADA', life: 3000});
        });
      }
      else {
        this.puntoventaService.agregar(this.token,this.puntoDeVenta).subscribe(data =>{
          this.cargarlistaPuntoVenta();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'PUNTA DE VENTA GUARDADA', life: 3000});
        });
      }

      this.modal = false;
      this.puntoDeVenta = this.inicializarPuntoDeVenta();
      return true;
  }

  buscarPorId(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listaPuntoVenta.length; i++) {
      if (this.listaPuntoVenta[i].codigopuntoventa.toString() === id) {
          index = i;
          break;
      }
    }
    return index;
  }

  validarDatos() : boolean{
    return this.validarCodigoPuntoVenta() ;
  }

  validarCodigoPuntoVenta(){
    return !(this.puntoDeVenta.nombrepuntoventa.length > 0);
  }

  //Para paginación y filtrado
  paginate(event:any) {
    this.pageIndex=event.first ;
    this.PaginacionService.Filtro.PageNumber=event.page+1;
    this.PaginacionService.Filtro.PageSize=event.rows;
    this.cargarlistaPuntoVenta();
  }

  filtrar() {
    this.pageIndex = 0;
    this.PaginacionService.Filtro.filter = this.filtro;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.PaginacionService.Filtro.PageSize = 5;
    this.cargarlistaPuntoVenta();
  }

}
