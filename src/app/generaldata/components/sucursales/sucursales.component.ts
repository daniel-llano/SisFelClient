import { Component, OnInit } from '@angular/core';

//PrimeNG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//Models
import { Sucursal } from 'src/app/shared/models/sucursal';

//Services
import { SucursalesService } from '../../services/sucursales/sucursales.service';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Component({
  selector: 'app-list',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})
export class SucursalesComponent implements OnInit {

  listaSucursales! : Sucursal[];

  sucursal : Sucursal = {
    codigosucursal : '',
    nombresucursal : '',
    direccion : '',
    barrio : '',
    municipio: '',
    telefono: '', 
    activo : true
  }

  intentoGuardar! : boolean;
  ventanaModal! : boolean;
  puedeEditarId! : boolean;

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
    private sucursalesService: SucursalesService, 
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
      this.cargarlistaSucursales();
    }
  }

  cargarlistaSucursales(){
    this.sucursalesService.listaPaginada(this.token, this.filtroEstado).subscribe((lista : any) => {
      this.listaSucursales = lista.data as Sucursal[];
      this.metadata = lista.meta;
      this.total = this.metadata.totalCount;
      this.pageSize = this.metadata.pageSize;
    });
  }

  inicializarSucursal(): Sucursal{
    let sucursal : Sucursal = {
      codigosucursal : '',
      nombresucursal : '',
      direccion : '',
      barrio : '',
      municipio: '',
      telefono: '', 
      activo : true
    }
    return sucursal;
  }

  abrirModalNuevoDato() {
    this.sucursal = this.inicializarSucursal();
    this.puedeEditarId = true;
    this.intentoGuardar = false;
    this.ventanaModal = true;
  }

  abriModalEditarDato(sucursal: Sucursal) {
    this.sucursal = {...sucursal};
    this.puedeEditarId = false;
    this.intentoGuardar = false;
    this.ventanaModal = true;
  }

  abrirModalEliminarDato(sucursal: Sucursal) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere deshabilitar al sucursal ' + sucursal.nombresucursal.toLocaleUpperCase() + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.sucursalesService.eliminar(this.token,sucursal.codigosucursal).subscribe(data => {
            this.cargarlistaSucursales();
          });
          this.sucursal = this.inicializarSucursal();
          this.messageService.add({severity:'warn', summary: 'EXITO', detail: 'SUCURSAL DESHABILITADA', life: 3000});
        }
    });
  }

  abrirModalHabilitarDato(sucursal: Sucursal) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere habilitar al sucursal ' + sucursal.nombresucursal.toLocaleUpperCase() + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.sucursalesService.habilitar(this.token,sucursal.codigosucursal).subscribe(data => {
            this.cargarlistaSucursales();
          });
          this.sucursal = this.inicializarSucursal();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'SUCURSAL HABILITADA', life: 3000});
        }
    });
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
      let indiceElemento = this.buscarPorId(this.sucursal.codigosucursal);
      if (indiceElemento != -1) {
        this.sucursalesService.modificar(this.token,this.sucursal).subscribe(data => {
          this.cargarlistaSucursales();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'SUCURSAL ACTUALIZADA', life: 3000});
        });
      }
      else {
        this.sucursalesService.agregar(this.token,this.sucursal).subscribe(data =>{
          this.cargarlistaSucursales();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'SUCURSAL GUARDADA', life: 3000});
        });
      }

      this.ventanaModal = false;
      this.sucursal = this.inicializarSucursal();
      return true;
    }
  }

  buscarPorId(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listaSucursales.length; i++) {
      if (this.listaSucursales[i].codigosucursal === id) {
          index = i;
          break;
      }
    }
    return index;
  }

  isNumber(value: string | number): boolean
  {
    return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
  }

  validarDatos() : boolean{
    return this.validarCodigoSucursal() && this.validarNombreSucursal() && this.validarNombreSucursal() && this.validarDireccion() && this.validarBarrio() && this.validarMunicipio() && this.validarTelefono();
  }

  validarCodigoSucursal() : boolean{ 
    let esNumero = this.isNumber(this.sucursal.codigosucursal);
    if (this.puedeEditarId)
      esNumero = esNumero && !this.listaSucursales.some(el => parseInt(el.codigosucursal) == parseInt(this.sucursal.codigosucursal));
    return esNumero;
  }

  validarNombreSucursal() : boolean{
    return !(this.sucursal.nombresucursal == "" || this.sucursal.nombresucursal.length > 60);
  }

  validarDireccion() : boolean{
    return !(this.sucursal.direccion == "" || this.sucursal.direccion.length > 100);
  }

  validarBarrio() : boolean{
    return !(this.sucursal.barrio == "" || this.sucursal.barrio.length > 60);
  }
  validarMunicipio() : boolean{
    return !(this.sucursal.municipio == "" || this.sucursal.municipio.length > 35);
  }
  validarTelefono() : boolean{
    return !(this.sucursal.telefono == "" || this.sucursal.telefono.length > 40);
  }

  //Para paginación y filtrado
  paginate(event:any) {
    this.pageIndex=event.first ;
    this.PaginacionService.Filtro.PageNumber=event.page+1;
    this.PaginacionService.Filtro.PageSize=event.rows;
    this.cargarlistaSucursales();
  }

  filtrar() {
    this.pageIndex = 0;
    this.PaginacionService.Filtro.filter = this.filtro;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.PaginacionService.Filtro.PageSize = 5;
    this.cargarlistaSucursales();
  }

}