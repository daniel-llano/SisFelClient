import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';

// Models
import { Detalle } from 'src/app/shared/models/detalle';
import { Factura } from 'src/app/shared/models/factura';
import { RespuestaRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/respuestaRecepcion';

// Services
import { ManagementService } from '../../services/management/management.service';
import { FacturacionCompraVentaControllerService } from 'src/app/shared/services/impuestos/facturacionCompraVentaController/facturacion-compra-venta-controller.service';
import { FacturacionTelecomControllerService } from 'src/app/shared/services/impuestos/facturacionTelecomController/facturacion-telecom-controller.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ClientphoneService } from 'src/app/client/services/clientphone/clientphone.service';
import { TelefonoCliente } from 'src/app/shared/models/telefonocliente';
import { EmisionService } from '../../services/emision/emision.service';

@Component({
  selector: 'app-pending-invoices',
  templateUrl: './pending-invoices.component.html',
  styleUrls: ['./pending-invoices.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService,
  ],
})
export class PendingInvoicesComponent implements OnInit, AfterViewInit {
  
  cargando = false;
  mensajeCarga = "";

  listaFacturas!: Factura[];
  listaDetalles : Detalle[] = []; 
  listaTelefonosClientes : TelefonoCliente[] = [];
  
  ventanaModalDetalle!: boolean;

  // Variables utilizadas para el envio de archivos
  ventanaModalEnviarArchivos!: boolean;
  correoReceptor = '';
  intentoGuardarEnviarArchivos! : boolean;

  // Variables utilizadas para la busqueda de las facturas pendientes del  cliente
  ventanaModalBuscarFacturasCliente: boolean= false;
  telefonoCliente = 0;
  intentoBuscarFacturasCliente! : boolean;

  numeroFactura = 0;
  codigoFactura = 0;

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
    private managementService : ManagementService,
    private clientsPhoneService : ClientphoneService,
    private cdref: ChangeDetectorRef, 
    private facturaService: EmisionService,
    private facturacionCompraVentaControllerService : FacturacionCompraVentaControllerService,
    private facturacionTelecomControllerService : FacturacionTelecomControllerService,
    private messageService: MessageService,private confirmationService: ConfirmationService,private primengConfig: PrimeNGConfig
  ) {}
​
  ngOnInit(): void {
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

  ngAfterViewInit() {    
    this.abrirModalBuscarFacturasCliente();
    this.cdref.detectChanges();
  }

  cargarListas(){
    this.cargarListaClientes();
  }

  cargarListaClientes(){
    this.clientsPhoneService.obtenerLista(this.token).subscribe(lista => {
      this.listaTelefonosClientes = lista as TelefonoCliente[]
    })
  }
​
  cargarListaFacturasPendientes(codigoTelefonoCliente: string){
    this.managementService.obtenerListaFacturasPendientes(this.token, codigoTelefonoCliente).subscribe(lista =>{
      this.listaFacturas = lista as Factura[];
    })
  }


  abrirModalBuscarFacturasCliente(){
    this.ventanaModalBuscarFacturasCliente = true;
    this.telefonoCliente = 0;
    this.intentoBuscarFacturasCliente = false;
    this.listaFacturas = [];
    this.listaDetalles = [];
  }

  abrirModalDetalleFactura(detalles: Detalle[]){
    this.listaDetalles = detalles;
    this.ventanaModalDetalle = true;
  }

  abrirModalEnviarArchivos(factura : Factura){
    this.codigoFactura = factura.codigofactura;
    this.correoReceptor = factura.codigotelefonoclienteNavigation.email + '';
    this.ventanaModalEnviarArchivos = true; 
  }

  abrirModalCancelarFactura(codigoFactura : number, numeroFactura : number, codigoTelefonoCliente: string) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere cambiar el estado de la factura número ' + numeroFactura + ' a cancelada?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.managementService.cancelarFactura(this.token,codigoFactura).subscribe(data => {
            this.cargarListaFacturasPendientes(codigoTelefonoCliente);
            this.messageService.add(
              {
                severity:'success', 
                summary: 'EXITO', 
                detail: 'LA FACTURA FUE REGISTRADA COMO CANCELADA CORRECTAMENTE', 
                life: 3000
              });
          });
        }
    });
  }

  ocultarModalBuscarFacturasCliente(){
    this.ventanaModalBuscarFacturasCliente = false;
    this.telefonoCliente = 0;
    this.intentoBuscarFacturasCliente = false;
  }

  ocultarModalEnviarArchivos(){
    this.ventanaModalEnviarArchivos = false;
    this.correoReceptor = "";
    this.codigoFactura = 0;
    this.intentoGuardarEnviarArchivos = false;
  }

  buscarFacturasCliente(){
    this.intentoBuscarFacturasCliente = true;

    if(this.telefonoCliente> 6630001){
      let indiceCliente = this.buscarCliente();
      if(indiceCliente != -1){ 
        this.cargarListaFacturasPendientes(this.listaTelefonosClientes[indiceCliente].codigotelefonocliente);
        this.ocultarModalBuscarFacturasCliente();
        return true;
      }else{
        return false;
        
      }
    }else{
      return false;
    }
  }

  buscarCliente(): number {
    let index = -1;
    for (let i = 0; i < this.listaTelefonosClientes.length; i++) {
      if (this.listaTelefonosClientes[i].telefono == this.telefonoCliente) {
          index = i;
          break;
      }
    }
    return index;
  }

  descargarPDF(factura : Factura){
    this.managementService.cargarFactura(factura);
    this.confirmationService.confirm({
      message: '¿Está seguro de imprimir la factura número ' + this.numeroFactura + ' perteneciente a '+ factura.nombrerazonsocial+' ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : 'Si',
      
      accept: () => {
        window.print();
      }
    });
  }

  enviarArchivos() {
    this.intentoGuardarEnviarArchivos = true;

    if(!this.validarEmail()){
      return false; 
    }else{

      this.cargando = true;
      this.mensajeCarga = "Enviando archivos por correo..."

      // LLamando a backend para envio de correo con archivo xml y pdf 
      this.managementService.enviarArchivos(this.token, this.codigoFactura, this.correoReceptor).subscribe(pudoEnviar =>{
        if(pudoEnviar)
        {
          this.messageService.add({
            severity: 'success',
            summary: 'EXITO',
            detail: 'LOS ARCHIVOS FUERON ENVIADOS CORRECTAMENTE'
          });

          this.cargando = false;
          this.mensajeCarga = "";
        }
        else
        {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'LOS ARCHIVOS NO PUDIERON SER ENVIADOS, POR FAVOR VERIFIQUE SU CORREO E INTENTE NUEVAMENTE'
          });

          this.cargando = false;
          this.mensajeCarga = "";
        }
      }, error =>{
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'LOS ARCHIVOS NO PUDIERON SER ENVIADOS, POR FAVOR VERIFIQUE SU CORREO E INTENTE NUEVAMENTE'
        });

        this.cargando = false;
        this.mensajeCarga = "";
      })

      this.correoReceptor = '';
      this.ocultarModalEnviarArchivos();
      return true;
    }
  }

  validarEmail() : boolean {
    if(this.correoReceptor.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  verificarEstadoFactura(codigoPuntoVenta:number, cuf: string, codigoDocumentoSector : number, codigoFactura : number, codigoTelefonoCliente : string){
    let respuesta : RespuestaRecepcion = {
      codigoDescripcion : '',
      codigoEstado : 1,
      codigoRecepcion : '',
      mensajesList : [],
      transaccionField : true
    }


    // Consumiento servicio de SisFelApi
    if(codigoDocumentoSector == 1)
    {
      this.facturacionCompraVentaControllerService.verificarEstadoFactura(this.token,codigoPuntoVenta,cuf).subscribe(xrespuesta =>{
        respuesta = xrespuesta as RespuestaRecepcion

        if(respuesta.codigoDescripcion == 'RECHAZADA'){
          let listaMensajeError : string = '';
          respuesta.mensajesList.forEach(element => {
            listaMensajeError = listaMensajeError + element.descripcion;
          });
        
          // Mostrando mensaje de error modificando atributos para que no se cierre la ventana emergente
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: listaMensajeError,
            sticky : true
          });

          this.facturaService.registrarFacturaRechazada(this.token,codigoFactura).subscribe(data =>{
            this.messageService.add({
              severity:'error', 
              summary: 'ERROR', 
              detail: 'LA FACTURA FUE REGISTRADA COMO RECHAZADA POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE',
              sticky: true
            });

            this.cargarListaFacturasPendientes(codigoTelefonoCliente);
          })

        }else{
          this.messageService.add({
            severity: 'success',
            summary: 'EXITO',
            detail: 'LA FACTURA SE ENCUENTRA REGISTRADA EN EL SIN'
          });
        }
      })
    }
    
    if(codigoDocumentoSector == 22){
      this.facturacionTelecomControllerService.verificarEstadoFactura(this.token,codigoPuntoVenta,cuf).subscribe(xrespuesta =>{
        respuesta = xrespuesta as RespuestaRecepcion

        if(respuesta.codigoDescripcion == 'RECHAZADA'){
          let listaMensajeError : string = '';
          respuesta.mensajesList.forEach(element => {
            listaMensajeError = listaMensajeError + element.descripcion;
          });
        
          // Mostrando mensaje de error modificando atributos para que no se cierre la ventana emergente
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: listaMensajeError,
            sticky : true
          });

          this.messageService.add({severity:'error', summary: 'ERROR', detail:'POR FAVOR VERIFIQUE LOS DATOS DE LA FACTURA E INTENTE NUEVAMENTE'});
          this.facturaService.registrarFacturaRechazada(this.token,codigoFactura).subscribe(data =>{
            this.messageService.add({
              severity:'error', 
              summary: 'ERROR', 
              detail: 'LA FACTURA FUE REGISTRADA COMO RECHAZADA POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE',
              sticky: true
            });

            this.cargarListaFacturasPendientes(codigoTelefonoCliente);
          })

        }else{
          this.messageService.add({
            severity: 'success',
            summary: 'EXITO',
            detail: 'LA FACTURA SE ENCUENTRA REGISTRADA EN EL SIN'
          });
        }
      })
    }
  }
}
