import { Component, OnInit } from '@angular/core';
import { RespuestaRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/respuestaRecepcion';
import { RegistroCompra } from 'src/app/shared/models/registrocompra';
import { FacturacionCodigosService } from 'src/app/shared/services/impuestos/facturacionCodigos/facturacion-codigos.service';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {

  intentoGuardar = false;
  nitValido = true;

  cargando = false;

  listaTiposCompra = [
    { codigo : 1, descripcion: 'Compras para mercado interno con destino a actividades gravadas' },
    { codigo : 2, descripcion: 'Compras para mercado interno con destino a actividades no gravadas' },
    { codigo : 3, descripcion: 'Compras sujetas a proporcionalidad' },
    { codigo : 4, descripcion: 'Compras para exportaciones' },
    { codigo : 5, descripcion: 'Compras tanto para el mercado interno como para exportaciones' },
  ]

  compra : RegistroCompra = {
    codigocompra : 0,
    nrocompra : 0,
    nitemisor : 0,
    razonsocialemisor : '',
    codigoautorizacion : '',
    numerofactura : 0,
    numeroduidim : '0',
    fechaemision : new Date(),
    montototalcompra : 0.00,
    importeice : 0.00,
    importeiehd : 0.00,
    importeipj : 0.00,
    tasas : 0.00,
    otronosujetocredito : 0.00,
    importesexentos : 0.00,
    importetasacero : 0.00,
    subtotal : 0.00,
    descuento : 0.00,
    montogiftcard : 0.00,
    montototalsujetoiva : 0.00,
    creditofiscal : 0,
    tipocompra : '',
    codigocontrol : '0'
  }

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
    private facturacionCodigosService : FacturacionCodigosService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
    }
  }

  validarTipoCompra():boolean{
    return !( (this.compra.tipocompra)+''.trim() == '' || this.compra.tipocompra == null || +this.compra.tipocompra < 1 || +this.compra.tipocompra > 5);
  }

  validarFechaEmision():boolean{
    return !(this.compra.fechaemision == null || this.compra.fechaemision.getTime() > new Date().getTime());
  }

  validarNit():boolean{
    return !(this.compra.nitemisor < 1 || this.compra.nitemisor > 9999999999999 );
  }

  validarRazonSocial():boolean{
    return !( this.compra.razonsocialemisor.trim() == '' || this.compra.razonsocialemisor.length > 240)
  }

  validarCodigoAutorizacion():boolean{
    return !( this.compra.codigoautorizacion.trim() == '' || this.compra.codigoautorizacion.length>100)
  }

  validarCodigoControl():boolean{
    return !( this.compra.codigocontrol.trim() == '' || this.compra.codigocontrol.length > 17);
  }

  validarNumeroDuiDim():boolean{
    return !(this.compra.numeroduidim.trim() == '' || this.compra.numeroduidim.length > 15);
  }

  validarImporteICE():boolean{
    return !(this.compra.importeice < 0.00 || this.compra.importeice > 99999999999999.99);
  }

  validarImporteEHD():boolean{
    return !(this.compra.importeiehd < 0.00 || this.compra.importeiehd > 99999999999999.99);
  }

  validarImporteLPJ():boolean{
    return !(this.compra.importeipj < 0.00 || this.compra.importeipj > 99999999999999.99);
  }

  validarImportesExentos():boolean{
    return !(this.compra.importesexentos < 0.00 || this.compra.importesexentos > 99999999999999.99);
  }

  validarMontoGiftCard():boolean{
    return !(this.compra.montogiftcard < 0.00 || this.compra.montogiftcard > 99999999999999.99);
  }

  validarSubTotal():boolean{
    return !(this.compra.subtotal < 0.00 || this.compra.subtotal > 99999999999999.99);
  }

  validarDescuento():boolean{
    return !(this.compra.descuento < 0.00 || this.compra.descuento > 99999999999999.99);
  }

  validarTasas():boolean{
    return !(this.compra.tasas < 0.00 || this.compra.tasas > 99999999999999.99);
  }

  validarOtroNoSujetoCredito():boolean{
    return !(this.compra.otronosujetocredito < 0.00 || this.compra.otronosujetocredito > 99999999999999.99);
  }

  validarImporteTasaCero():boolean{
    return !(this.compra.importetasacero < 0.00 || this.compra.importetasacero > 99999999999999.99);
  }

  validarNroFactura():boolean{
    return !(this.compra.numerofactura <= 0 || this.compra.numerofactura> 99999999999999999999);
  }

  validarMontoTotalCompra():boolean{
    return !(this.compra.montototalcompra <= 0.00 || this.compra.montototalcompra > 99999999999999.99);
  }

  validarMontoTotalSujetoIVA():boolean{
    return !(this.compra.montototalsujetoiva < 0.00 || this.compra.montototalsujetoiva > 99999999999999.99);
  }

  validarCreditoFiscal():boolean{
    return !(this.compra.creditofiscal < 0.00 || this.compra.creditofiscal > 99999999999999.99);;
  }

  registrarCompra(){
    this.intentoGuardar = true;

    this.facturacionCodigosService.verificarNit(this.token, this.compra.nitemisor + "").subscribe(respuesta =>{
      let xrespuesta = respuesta as RespuestaRecepcion;
      this.nitValido = xrespuesta.mensajesList[0].descripcion == 'NIT ACTIVO';
      let datosValidos = this.validarDatos();

      if(datosValidos && this.nitValido){
        this.cargando = true;
        this.messageService.add({
          severity:'success',
          summary: 'EXITO', 
          detail: 'REGISTRO DE COMPRA GENERADO Y GUARDADO CORRECTAMENTE',
          life: 10000
        });
        this.cargando = false;
      }


    },error=>{
      console.log("error")
    });
  }

  validarDatos(): boolean {
    return (this.validarCodigoAutorizacion() && this.validarCodigoControl() && this.validarCreditoFiscal() && this.validarDescuento() && this.validarFechaEmision() 
    && this.validarImporteEHD() && this.validarImporteICE() && this.validarImporteLPJ() && this.validarImporteTasaCero() && this.validarImportesExentos()
    && this.validarMontoGiftCard() && this.validarMontoTotalCompra() && this.validarMontoTotalSujetoIVA() && this.validarNit() && this.validarNroFactura() 
    && this.validarNumeroDuiDim() && this.validarOtroNoSujetoCredito() && this.validarRazonSocial() && this.validarSubTotal() && this.validarTasas()
    && this.validarTipoCompra()) 
  }

  // Valores calculables
  // SUBTOTAL = IMPORTE TOTAL DE LA COMPRA - IMPORTE ICE - IMPORTE IEHD - IMPORTE IPJ - TASAS - OTROS NO SUJETOS A CRÉDITO FISCAL - OPERACIONES EXENTAS - IMPORTE COMPRAS GRAVADAS A TASA CERO.
  calcularSubTotal(){
    this.compra.subtotal = this.compra.montototalcompra - this.compra.importeice - this.compra.importeiehd - this.compra.importeipj - this.compra.tasas 
    - this.compra.otronosujetocredito - this.compra.importesexentos - this.compra.importetasacero;  
    this.compra.montototalsujetoiva = this.compra.subtotal;
    this.calcularCreditoFiscal();
  }

  // IMPORTE BASE PARA CRÉDITO FISCAL = SUBTOTAL - DESCUENTOS, BONIFICACIONES Y REBAJAS OBTENIDAS - IMPORTE GIFT CARD
  calcularImporteBaseCreditoFiscal(): number{
    return this.compra.subtotal - this.compra.descuento - this.compra.montogiftcard;
  }

  // CRÉDITO FISCAL = IMPORTE BASE PARA CRÉDITO FISCAL * 13%
  calcularCreditoFiscal(){
    this.compra.creditofiscal = this.calcularImporteBaseCreditoFiscal() * 0.13;
  }


} 
