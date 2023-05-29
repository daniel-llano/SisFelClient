import { Component, OnInit } from '@angular/core';

//PrimeNG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//Models
import { Cliente } from 'src/app/shared/models/cliente';
import { RespuestaRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/respuestaRecepcion';
import { TelefonoCliente } from 'src/app/shared/models/telefonocliente';
import { FacturacionCodigosService } from 'src/app/shared/services/impuestos/facturacionCodigos/facturacion-codigos.service';

//Services
import { ClientService } from '../../services/client/client.service';
import { ClientphoneService } from '../../services/clientphone/clientphone.service';
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

  listaClientes! : Cliente[];

  cliente : Cliente = {
    codigocliente : '',
    datoscliente : '',
    ci : '0',
    tipopersona : '',
    telefonoclientes : [],
    activo : true
  }

  telefonocliente : TelefonoCliente = {
    codigotelefonocliente : '0',
    codigocliente : '',
    codigotipodocumentoidentidad: 5,
    nit : '0',
    ci : '0',
    complemento : '',
    razonsocial : '',
    email : '',
    telefono : 0,
    activo : true
  }

  nitValido : boolean = true;

  intentoGuardar!: boolean;
  ventanaModal!: boolean;
  puedeEditarId! : boolean;

  intentoGuardarTelefono!: boolean;
  ventanaModalTelefono!: boolean;
  ventanaModalListaTelefonos!: boolean;
  puedeEditarIdTelefono! : boolean;

  //variables para la paginacion
  metadata : any;
  total = 0;
  pageSizeOptions : number[] = [5, 10, 25, 100];
  pageSize = 5;
  pageIndex : number=0;
  filtro = "";
  filtroEstadoCliente : boolean = true;

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
    private facturacionCodigosService : FacturacionCodigosService,
    private clientsService: ClientService,
    private clientPhonesService : ClientphoneService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private primengConfig: PrimeNGConfig,
    private PaginacionService: PaginacionService
  ) { }

  ngOnInit() {
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
      this.cargarListaClientes();
    }
  }

  cargarListaClientes(){
      this.clientsService.listaPaginada(this.token, this.filtroEstadoCliente).subscribe((lista : any) => {
      this.listaClientes = lista.data as Cliente[];
      this.metadata = lista.meta;
      this.total=this.metadata.totalCount;
      this.pageSize=this.metadata.pageSize;
    });
  }

  inicializarCliente(): Cliente{
    let cliente : Cliente = {
      codigocliente : '',
      datoscliente : '',
      ci : '0',
      tipopersona : '',
      telefonoclientes : [],
      activo : true
    }
    return cliente;
  }

  inicializarTelefonoCliente() : TelefonoCliente{
    let telefonocliente : TelefonoCliente = {
      codigotelefonocliente : '0',
      codigocliente : '',
      codigotipodocumentoidentidad: 5,
      nit : '0',
      ci : '0',
      complemento : '',
      razonsocial : '',
      email : '',
      telefono : 0,
      activo : true
    }
    return telefonocliente;
  }

  abrirModalNuevoDato() {
    this.cliente = this.inicializarCliente();
    this.cliente.codigocliente = '';
    this.puedeEditarId = true;
    this.intentoGuardar = false;
    this.ventanaModal = true;
  }

  abriModalEditarDato(cliente: Cliente) {
    this.cliente = {...cliente};
    this.puedeEditarId = false;
    this.ventanaModal = true;
  }

  abrirModalEliminarDato(cliente: Cliente) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere deshabilitar al cliente ' + + cliente.datoscliente.toLocaleUpperCase() + ' con C.I.: ' + cliente.ci+ '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.clientsService.eliminar(this.token,cliente.codigocliente).subscribe(data => {
            this.cargarListaClientes();
          });
          this.cliente = this.inicializarCliente();
          this.messageService.add({severity:'warn', summary: 'EXITO', detail: 'CLIENTE DESHABILITADO', life: 3000});
        }
    });
  }

  abrirModalHabilitarDato(cliente: Cliente) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere habilitar al cliente ' + cliente.datoscliente.toLocaleUpperCase() + ' con C.I.: ' + cliente.ci+ '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.clientsService.habilitar(this.token,cliente.codigocliente).subscribe(data => {
            this.cargarListaClientes();
          });
          this.cliente = this.inicializarCliente();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'CLIENTE HABILITADO', life: 3000});
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
      let indiceElemento = this.buscarPorId(this.cliente.codigocliente);
      if (indiceElemento != -1) {
        this.clientsService.modificar(this.token,this.cliente).subscribe(data => {
          this.cargarListaClientes();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'CLIENTE ACTUALIZADO', life: 3000});
        }, error => {
          console.log("E:" + error.message);
          this.messageService.add({
            severity:'error', 
            summary: 'ERROR', 
            detail: 'OCURRIO UN ERROR AL ACTUALIZAR LOS DATOS DEL CLIENTE',
            sticky: true
           });
        });
      }
      else {
        this.clientsService.agregar(this.token,this.cliente).subscribe(data =>{
          this.cargarListaClientes();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'CLIENTE GUARDADO', life: 3000});
        }, error => {
          console.log("E:" + error.message);
          this.messageService.add({
            severity:'error', 
            summary: 'ERROR', 
            detail: 'OCURRIO UN ERROR AL GUARDAR LOS DATOS DEL CLIENTE',
            sticky: true
           });
        });
      }

      this.ventanaModal = false;
      this.cliente = this.inicializarCliente();
      return true;
    }
  }

  buscarPorId(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listaClientes.length; i++) {
      if (this.listaClientes[i].codigocliente === id) {
          index = i;
          break;
      }
    }
    return index;
  }

  validarDatos():boolean{
    return this.validarCodigoCliente(this.cliente.codigocliente) && this.validarDatosCliente() && this.validarCi(this.cliente.ci) && this.validarTipoPersona()
  }

  validarCodigoCliente(codigoCliente : string) : boolean{
    return !(codigoCliente == "" || codigoCliente.length > 10);
  }

  validarDatosCliente() : boolean{
    return !(this.cliente.datoscliente == "" || this.cliente.datoscliente.length > 100);
  }

  validarCi(ci : string) : boolean{
    return !(ci == "" || ci.length > 50);
  }

  validarComplemento(complemento : string) : boolean{
    return !(complemento.length > 2)
  }

  validarTipoPersona():boolean {
    return !(this.cliente.tipopersona.trim() == '');
  }

  //Metodos para la gestion de telefonos del cliente
  cargarListaClientesTelefono(indiceCliente : number){
    this.clientsService.obtenerLista(this.token, "true").subscribe(lista => {
      this.listaClientes = lista as Cliente[];
      this.cliente = {... this.listaClientes[indiceCliente]};
    });
  }

  abrirModalListaTelefonos(cliente : Cliente) {
    this.cliente = {...cliente};
    this.ventanaModalListaTelefonos = true;
  }

  abrirModalNuevoDatoTelefono(cliente:Cliente) {
    this.telefonocliente = this.inicializarTelefonoCliente();
    this.telefonocliente.codigocliente = cliente.codigocliente;
    this.puedeEditarIdTelefono = true;
    this.intentoGuardarTelefono = false;
    this.ventanaModalTelefono = true;
  }

  abrirModalEditarDatoTelefono(telefonoCliente: TelefonoCliente) {
    this.telefonocliente = {...telefonoCliente};
    this.ventanaModalTelefono = true;
    this.puedeEditarIdTelefono = false;
  }

  ocultarModalTelefono() {
    this.ventanaModalTelefono = false;
    this.intentoGuardarTelefono = false;
  }

  guardarDatosTelefono() {
    this.intentoGuardarTelefono = true;
    
    this.facturacionCodigosService.verificarNit(this.token, this.telefonocliente.nit).subscribe(respuesta =>{
      let xrespuesta = respuesta as RespuestaRecepcion;
      if(xrespuesta == null){
        this.nitValido = false;  
      }else{
        this.nitValido = xrespuesta.mensajesList[0].descripcion == 'NIT ACTIVO';
      }
      
      let datosValidos = this.validarDatosTelefono();

      if(!datosValidos){
        return false;
      }else{
        this.telefonocliente.nit = this.telefonocliente.nit.trim()
        this.telefonocliente.ci = this.telefonocliente.ci.trim()
      
        let indiceElemento = this.buscarPorIdTelefono(+this.telefonocliente.codigotelefonocliente);
        if (indiceElemento != -1) {
          
          let indiceCliente = this.buscarPorId(this.telefonocliente.codigocliente);

          this.clientPhonesService.modificar(this.token,this.telefonocliente).subscribe(data => {
            this.cargarListaClientesTelefono(indiceCliente);
            this.messageService.add({severity:'success', summary: 'EXITO', detail: 'TELEFONO DEL CLIENTE ACTUALIZADO', life: 3000});
          }, error => {
            console.log("E:" + error.message);
            this.messageService.add({
              severity:'error', 
              summary: 'ERROR', 
              detail: 'OCURRIO UN ERROR AL ACTUALIZAR EL TELEFONO DEL CLIENTE',
              sticky: true
             });
          });
        }
        else {

            this.clientPhonesService.agregar(this.token,this.telefonocliente).subscribe(data =>{
              this.cargarListaClientes();
              this.messageService.add({severity:'success', summary: 'EXITO', detail: 'TELEFONO DEL CLIENTE GUARDADO', life: 3000});
            }, error => {
              console.log("E:" + error.message);
              this.messageService.add({
                severity:'error', 
                summary: 'ERROR', 
                detail: 'OCURRIO UN ERROR AL GUARDAR EL TELEFONO DEL CLIENTE',
                sticky: true
               });
            });
        }
  
        
        this.ventanaModalTelefono = false;
        this.telefonocliente = this.inicializarTelefonoCliente();
        return true;
      }

    }, error => {
      console.log("E:" + error.message);
      this.messageService.add({
        severity:'error', 
        summary: 'ERROR', 
        detail: 'OCURRIO UN ERROR AL VALIDAR EL NIT DEL CLIENTE SIN',
        sticky: true
       });
    });
  }

  buscarPorIdTelefono(id: number): number {
    let index = -1;
    for (let i = 0; i < this.cliente.telefonoclientes.length; i++) {
      if (+this.cliente.telefonoclientes[i].codigotelefonocliente === id) {
          index = i;
          break;
      }
    }
    return index;
  }
  
  validarDatosTelefono():boolean{
    if(this.telefonocliente.codigotipodocumentoidentidad == 5){
      return this.validarCodigoTelefonoCliente() && this.validarTelefono()  && this.validarCodigoCliente(this.telefonocliente.codigocliente) && this.validarNit() && this.nitValido && this.validarRazonSocial() && this.validarEmail()
    }else if(this.telefonocliente.codigotipodocumentoidentidad == 1){
      return this.validarCodigoTelefonoCliente() && this.validarTelefono() && this.validarCodigoCliente(this.telefonocliente.codigocliente) && this.validarCi(this.telefonocliente.ci) && this.validarComplemento(this.telefonocliente.complemento) && this.validarRazonSocial() && this.validarEmail()
    }else{
      return false;
    }
  }

  validarCodigoTelefonoCliente() : boolean{
    return !(this.telefonocliente.codigotelefonocliente == "0" || this.telefonocliente.codigotelefonocliente.length > 10);
  }

  validarTelefono() : boolean {
    return !(this.telefonocliente.telefono < 999999 || this.telefonocliente.telefono > 999999999) 
  }

  validarNit() : boolean {
    return !( (this.telefonocliente.nit+'').trim().length < 8 || (this.telefonocliente.nit+'').trim().length > 20 )
  }

  validarRazonSocial() : boolean {
    return !( this.telefonocliente.razonsocial == '' || this.telefonocliente.razonsocial.length > 100)
  }

  validarEmail() : boolean {
    if(this.telefonocliente.email.length < 70 && this.telefonocliente.email.trim() != '' && this.telefonocliente.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    {
      return true;
    }
    else if(this.telefonocliente.email.trim() == "")
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  //Para paginación y filtrado
  paginate(event:any) {
    this.pageIndex=event.first ;
    this.PaginacionService.Filtro.PageNumber=event.page+1;
    this.PaginacionService.Filtro.PageSize=event.rows;
    this.cargarListaClientes();
  }

  filtrar() {
    this.pageIndex = 0;
    this.PaginacionService.Filtro.filter = this.filtro;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.PaginacionService.Filtro.PageSize = 5;
    this.cargarListaClientes();
  }

}