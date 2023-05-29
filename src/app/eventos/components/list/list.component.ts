import { Component, OnInit } from '@angular/core';

//PrimeNG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//Models
import { Evento } from 'src/app/shared/models/eventos';
import { MotivoEvento } from 'src/app/shared/models/motivoEvento';

//Service
import { EventosService } from '../../services/eventos.service';
import { UnitsService } from 'src/app/generaldata/services/units/units.service';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})
export class ListComponent implements OnInit {

  modal!: boolean;
  editar: boolean = false;
  guardar : boolean = false;
  codigoPuntoVenta! : number;

  listaEventos! : Evento[];
  listaMotivoEvento! : MotivoEvento[];

  evento : Evento = {
    codigoevento: 0,
    codigomotivoevento: "",
    codigorecepcionevento: 0,
    codigopuntoventa: 0,
    cafccompraventa: '',
    cafctelecom: '',
    cuis: '',
    cufd: '',
    cufdevento: '',
    descripcion: '',
    fechahorainicioevento: new Date,
    fechafinevento: new Date,
    activo: true
  } 
  
  //variables para la paginacion
  metadata : any;
  total = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 5;
  pageIndex : number = 0;
  filtro = "";
  filtroEstado : boolean = true;

  //Datos de sesion
  token! : string;
  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor( 
    private eventosService: EventosService,
    private unitsService: UnitsService,
    //private parametroService: ParametrosService,
    private PaginacionService: PaginacionService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
        this.codigoPuntoVenta = this.datosLocalStorage.cpdv;
        console.log("cpdv: " + this.codigoPuntoVenta)
    }

    if(this.token!= null){
      this.cargarLista();
    }
  }

  cargarLista(){
    this.cargarListaEventos();
    //this.CargarListaParametros();
    this.cargarListaMotivoEvento();
  }

  cargarListaEventos(){
    this.eventosService.listaPaginada(this.token, this.filtroEstado).subscribe((lista : any) => {
      this.listaEventos = lista.data as Evento[];
      this.metadata = lista.meta;
      this.total = this.metadata.totalCount;
      this.pageSize = this.metadata.pageSize;
    });
  }

  cargarListaMotivoEvento(){
    this.unitsService.obtenerListaMotivosEvento(this.token).subscribe(lista=> {
      this.listaMotivoEvento = lista as MotivoEvento[];
    })
  }

  inicializarEvento() : Evento{
    let evento : Evento = {
      codigoevento: 0,
      codigomotivoevento: "",
      codigorecepcionevento: 0,
      codigopuntoventa: this.codigoPuntoVenta,
      cafccompraventa: '',
      cafctelecom: '',
      cuis: '',
      cufd: '',
      cufdevento: '',
      descripcion: '',
      fechahorainicioevento: new Date,
      fechafinevento: new Date,
      activo: true
    }
    return evento;
  }

  modalAgregar() {
    this.evento = this.inicializarEvento();
    this.guardar = false;
    this.modal = true;
    this.editar=false;
  }

  modalEditar(evento : Evento) {
    this.evento = {...evento};
    this.evento.codigomotivoevento = this.evento.codigomotivoevento + "";
    this.modal = true;
    this.editar = true;
  }

  modalHabilitar(evento: Evento) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere habilitar el evento ' + evento.codigoevento + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.eventosService.activo(this.token, evento.codigoevento).subscribe(data => {
            this.cargarListaEventos();
          });
          this.evento = this.inicializarEvento();
          this.messageService.add({severity:'success', summary: 'Exito', detail: 'Evento Habilitado', life: 3000});
        }
    });
  }

  modalDetener(evento: Evento) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere detener el evento ' + evento.codigoevento + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.eventosService.detener(this.token, evento.codigoevento).subscribe(data => {
            this.cargarListaEventos();
          });
          this.evento = this.inicializarEvento();
          this.messageService.add({severity:'success', summary: 'Exito', detail: 'Evento Habilitado', life: 3000});
        }
    });
  }

  ocultarModal() {
    this.modal = false;
    this.guardar = false;
    this.editar = false;
  }

  guardarDatos() {
    this.guardar = true;
    console.log(this.evento)
    if(!this.validarDatos()){
      return false;
    }else{
      let indiceElemento = this.findIndexById(this.evento.codigoevento);
      if (indiceElemento != -1) {
        this.eventosService.modificar(this.token, this.evento).subscribe(data => {
          this.cargarListaEventos();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'EVENTO ACTUALIZADO', life: 3000});
          this.ocultarModal();
          this.evento = this.inicializarEvento();
        }, error =>{
          console.log("E:"+error.message)
          this.messageService.add({severity:'error', summary: 'ERROR', detail: 'OCURRIO UN ERROR AL ACTUALIZAR EL EVENTO POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE', life: 3000});
        });   
      }
      else {
          this.eventosService.agregar(this.token,this.evento).subscribe(data =>{
            this.cargarListaEventos();
            this.messageService.add({severity:'success', summary: 'EXITO', detail: 'EVENTO GUARDADO', life: 3000});
            this.ocultarModal();
            this.evento = this.inicializarEvento();
          }, error =>{
            console.log("E:"+error.message)
            this.messageService.add({severity:'error', summary: 'ERROR', detail: 'OCURRIO UN ERROR AL GUARDAR EL EVENTO POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE', life: 3000});
          })
      }
      return true;
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    if(id != null)
    for (let i = 0; i < this.listaEventos.length; i++) {
      if (this.listaEventos[i].codigoevento == id ) {
          index = i;
          break;
      }
    }
    return index;
  }
  
  validarDatos():boolean{
    return this.validarCodMotivoEvento();
  }

  validarCodMotivoEvento(): boolean {
    return !(this.evento.codigomotivoevento == "0");
  }

   //Para paginación y filtrado
   paginate(event:any) {
    this.pageIndex=event.first ;
    this.PaginacionService.Filtro.PageNumber=event.page+1;
    this.PaginacionService.Filtro.PageSize=event.rows;
    this.cargarListaEventos();
  }

  filtrar() {
    this.pageIndex = 0;
    this.PaginacionService.Filtro.filter = this.filtro;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.PaginacionService.Filtro.PageSize = 5;
    this.cargarListaEventos();
  }

}