import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

// Models
import { Detalle } from 'src/app/shared/models/detalle';
import { Factura } from 'src/app/shared/models/factura';
import { RespuestaRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/respuestaRecepcion';
import { Parametro } from 'src/app/shared/models/parametro';

// Services
import { ManagementService } from '../../services/management/management.service';
import { FacturacionCompraVentaControllerService } from 'src/app/shared/services/impuestos/facturacionCompraVentaController/facturacion-compra-venta-controller.service';
import { FacturacionTelecomControllerService } from 'src/app/shared/services/impuestos/facturacionTelecomController/facturacion-telecom-controller.service';
import { ParametrosService } from 'src/app/shared/services/impuestos/parametros/parametros.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { EmisionService } from '../../services/emision/emision.service';

//ROUTEADOR
import { Router } from '@angular/router';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})

export class ManagementComponent implements OnInit {

  cargando = false;
  mensajeCarga = "";

  filtroEstadoFactura : string = 'PENDIENTE'

  listaFacturas!: Factura[];
  listaDetalles : Detalle[] = []; 
  
  ventanaModalDetalle!: boolean;
  intentoGuardar!: boolean;
  
  // Variables utilizadas para anulacion de factura
  ventanaModalAnular!: boolean;
  intentoAnular!:boolean;
  codigoPuntoVenta! : number;
  codigoFactura!: number;
  numeroFactura!: number;
  codigoDocumentoSector!: number;
  cuf!: string;
  codigoMotivoAnulacion: number = 0;
  listaMotivosAnulacion! : Parametro[];

  // Variables utilizadas para el envio de archivos
  ventanaModalEnviarArchivos!: boolean;
  correoReceptor = '';
  intentoGuardarEnviarArchivos! : boolean;
  
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
    private Router: Router,
    private managementService : ManagementService,
    private emisionService : EmisionService,
    private parametrosService : ParametrosService,
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

  cargarListas(){
    this.cargarListaFacturas();
    this.cargarListaMotivosAnulacion();
  }
​
  cargarListaFacturas(){
    this.managementService.obtenerLista(this.token, this.filtroEstadoFactura).subscribe(lista =>{
      this.listaFacturas = lista as Factura[];
    })
  }

  cargarListaMotivosAnulacion(){
    this.parametrosService.obtenerListaMotivosAnulacion(this.token).subscribe(lista => {
      this.listaMotivosAnulacion = lista as Parametro[];
    })
  }

  abrirModalAnularFactura(codigoPuntoVenta: number, codigoFactura: number, numeroFactura: number, codigoDocumentoSector: number, cuf: string){
    this.ventanaModalAnular = true;
    this.codigoPuntoVenta  = codigoPuntoVenta;
    this.numeroFactura = numeroFactura;
    this.codigoFactura = codigoFactura;
    this.codigoDocumentoSector = codigoDocumentoSector;
    this.cuf = cuf;
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

  ocultarModalAnular(){
    this.ventanaModalAnular = false;
    this.codigoMotivoAnulacion = 0;
    this.intentoGuardar = false;
  }

  ocultarModalEnviarArchivos(){
    this.ventanaModalEnviarArchivos = false;
    this.correoReceptor = "";
    this.codigoFactura = 0;
    this.intentoGuardarEnviarArchivos = false;
  }

  anularFactura() {
    this.intentoGuardar = true;

    if(!this.validarDatos()){
      return false; 
    }else{

      this.ventanaModalAnular = false;
      let nombreDocumentoSector = '';

      if(this.codigoDocumentoSector == 22){
        nombreDocumentoSector = 'Telecomunicaciones'
      }else if(this.codigoDocumentoSector == 1){
        nombreDocumentoSector = 'Compra Venta'
      }

      // Solicitando confirmacion
      this.confirmationService.confirm({
        message: '¿Está seguro de anular la factura número ' + this.numeroFactura + ' perteneciente al documento sector '+ nombreDocumentoSector+' ?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        
        accept: () => {
          let respuesta : RespuestaRecepcion = {
            codigoDescripcion : '',
            codigoEstado : 1,
            codigoRecepcion : '',
            mensajesList : [],
            transaccionField : true
          }

          // Consumiento servicio de SisFelApi
          if(this.codigoDocumentoSector == 1)
          {
            // Anulando factura del Sector Compra Venta
            this.facturacionCompraVentaControllerService.anularFactura(this.token,this.codigoPuntoVenta,this.cuf,this.codigoMotivoAnulacion).subscribe(xrespuesta =>{
              respuesta = xrespuesta as RespuestaRecepcion;
              
              if(respuesta.codigoDescripcion == 'ANULACION RECHAZADA'){
                let listaMensajeError : string = '';
                respuesta.mensajesList.forEach(element => {
                  listaMensajeError = listaMensajeError + element.descripcion;
                });
              
                // Mostrando mensaje de error modificando atributos para que no se cierre la ventana emergente
                this.messageService.add({
                  severity: 'error',
                  summary: 'ERROR',
                  detail: 'NO SE PUDO ANULAR LA FACTURA: ' + listaMensajeError,
                  sticky : true
                });
              }else{

                this.managementService.anularFactura(this.token,this.codigoFactura).subscribe( data =>{
                  this.cargarListaFacturas();
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'EXITO',
                    detail: 'LA FACTURA FUE ANULADA CORRECTAMENTE EN EL SIN'
                  });
                });
              }

            });
            
          }

          if(this.codigoDocumentoSector == 22)
          {
            // Anulando factura del Sector Telecomunicaciones
            this.facturacionTelecomControllerService.anularFactura(this.token,this.codigoPuntoVenta,this.cuf,this.codigoMotivoAnulacion).subscribe(xrespuesta =>{
              respuesta = xrespuesta as RespuestaRecepcion;
              
              if(respuesta.codigoDescripcion == 'ANULACION RECHAZADA'){
                let listaMensajeError : string = '';
                respuesta.mensajesList.forEach(element => {
                  listaMensajeError = listaMensajeError + element.descripcion;
                });

                // Mostrando mensaje de error modificando atributos para que no se cierre la ventana emergente
                this.messageService.add({
                  severity: 'error',
                  summary: 'ERROR',
                  detail: 'NO SE PUDO ANULAR LA FACTURA: ' + listaMensajeError,
                  sticky : true
                });
              }else{
                this.managementService.anularFactura(this.token,this.codigoFactura).subscribe( data =>{
                  this.cargarListaFacturas();
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'EXITO',
                    detail: 'LA FACTURA FUE ANULADA CORRECTAMENTE EN EL SIN',
                    sticky : true
                  });
                });
              }
            })
          }

          // Inicializando datos
          this.cuf = '';
          this.codigoDocumentoSector = 1;
          this.codigoMotivoAnulacion = 0;
          this.intentoGuardar = false;
        },
        reject : () => {
          // Inicializando datos
          this.cuf = '';
          this.codigoDocumentoSector = 1;
          this.codigoMotivoAnulacion = 0;
          this.intentoGuardar = false;
        }

      });
      return true;
    }
  }

  validarDatos():boolean{
      return !((this.codigoDocumentoSector != 1 && this.codigoDocumentoSector != 22) || (this.cuf == '' || this.cuf == null) || this.codigoMotivoAnulacion == 0);
  }

  imprimirPDF(factura : Factura){
    this.managementService.cargarFactura(factura);
    this.confirmationService.confirm({
      message: '¿Está seguro de imprimir la factura número ' + factura.numerofactura + ' perteneciente a '+ factura.nombrerazonsocial+' ?',
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

      // LLamando a SisFelApi para envio de correo con archivo xml y pdf 
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

  volverEmitirFactura(factura : Factura){
    this.emisionService.cargarFactura(factura);
    this.confirmationService.confirm({
      message: '¿Está seguro de volver a emitir la factura perteneciente a '+ factura.nombrerazonsocial+' ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : 'Si',
      
      accept: () => {
        this.Router.navigate(['/facturacion/individual']);
      }
    });
  }

  verificarEstadoFactura(codigoPuntoVenta:number, cuf: string, codigoDocumentoSector : number, codigoFactura : number){
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
        
          // Mostrando mensaje de error modificando atributos para que no se cierre ventana emergente
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

            this.cargarListaFacturas();
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

          this.facturaService.registrarFacturaRechazada(this.token,codigoFactura).subscribe(data =>{
            this.messageService.add({
              severity:'error', 
              summary: 'ERROR', 
              detail: 'LA FACTURA FUE REGISTRADA COMO RECHAZADA POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE',
              sticky: true
            });

            this.cargarListaFacturas();
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
