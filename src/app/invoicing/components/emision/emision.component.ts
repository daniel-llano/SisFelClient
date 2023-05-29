import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';

//PrimeNG
import { ConfirmationService, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//Models
import { Factura } from 'src/app/shared/models/factura';
import { Detalle } from 'src/app/shared/models/detalle'; 
import { Producto } from 'src/app/shared/models/product';
import { TelefonoCliente } from 'src/app/shared/models/telefonocliente';

//Services
import { ProductsService } from 'src/app/products/services/products/products.service';
import { ClientService } from 'src/app/client/services/client/client.service';
import { ClientphoneService } from 'src/app/client/services/clientphone/clientphone.service';
import { EmisionService } from '../../services/emision/emision.service';
import { RespuestaRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/respuestaRecepcion';


@Component({
  selector: 'app-emision',
  templateUrl: './emision.component.html',
  styleUrls: ['./emision.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image .p-cell-editing {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
  providers: [MessageService,ConfirmationService]
})
export class EmisionComponent implements OnInit {

  cargando = false;
  mensajeCarga = "";

  telefonoCorrecto : boolean = true;
  descuentoT: number = 0;

  estaEditando = false;
  clonDetalles! : Detalle[];

  // Variables 
  factura : Factura = {
    codigofactura : 0,
    codigorecepcion: '0',
    nitemisor: 0,
    municipio: '',
    telefonoemisor: 0,
    nitconjunto: '',
    numerofactura: 1,
    cuf: '',
    cufd: '',
    codigosucursal: 0,
    direccion: '',
    codigopuntoventa: 0,
    cafc: '',
    fechaemision: new Date(),
    nombrerazonsocial: '',
    codigotipodocumentoidentidad: 0,
    numerodocumento: '',
    complemento: '',
    codigotelefonocliente: '0',
    codigometodopago: 0, //Se sacará de la tabla parametros
    nrotarjeta: 0,
    montototal: 0,
    montototalsujetoiva: 0,
    codigomoneda: 0, //Se sacará de la tabla parametros
    leyenda: '',
    usuario: 'admin',
    codigodocumentosector: 1, //  Se sacará de la tabla parametros 1 o 22
    estadoFactura: '',
    descuentoadicional : 0,
    facturadetalles : [],
    codigotelefonoclienteNavigation : {
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
  };

  detalle : Detalle= {
    codigofacturadetalle: 0,
    codigofactura: 0,
    codigoproducto: '',
    actividadeconomica: '',
    codigoproductosin: 0,
    descripcion: '',
    cantidad: 0,
    unidadmedida: 0,
    preciounitario: 0,
    montodescuento: 0,
    subtotal: 0,
    cuenta: '',
    numeroSerie: '',
    numeroImei: '',
    codigoGrupo: '',
  }
  

  detalles : Detalle[]= [];

  // Datos utilizados de otras vistas
  producto!: Producto;
  listaProductos!:Producto[];
  listaTelefonosClientes:TelefonoCliente[] = [];

  // Datos Generales
  token! : string;
  codigoPuntoVenta : number = -1;
  codigoSucursal : number = -1;
  usuario : string = '';
  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }
 
  constructor( 
    private productsService : ProductsService,
    private clientsPhoneService : ClientphoneService,
    private cdref: ChangeDetectorRef,
    private facturaService: EmisionService,
    private messageService: MessageService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) 
  {
    
  }
   
  ngOnInit() {
    this.primengConfig.ripple = true;

    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
        this.codigoPuntoVenta = this.datosLocalStorage.cpdv as number;
        this.codigoSucursal = this.datosLocalStorage.cs as number;
        this.usuario = this.datosLocalStorage.nu as string;
    }

    if(this.token!= null){
      this.cargarListas();
    }
  }

  ngAfterViewInit() {   
    this.factura = this.facturaService.obtenerFactura();

    this.factura.facturadetalles.forEach((detalle:Detalle, index) =>{
      detalle.montodescuento = (detalle.montodescuento / (detalle.cantidad * detalle.preciounitario)) * 100;
      this.detalles.push(detalle)
    });
    
    if(this.factura.descuentoadicional > 0)
      this.factura.descuentoadicional = (this.factura.descuentoadicional / (this.factura.montototal + this.factura.descuentoadicional)) * 100;
    this.calcularTotal();
    
    this.cdref.detectChanges();
    this.facturaService.inicializarFactura();
  }

  actualizarVariablesGlobales(){
    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
        this.codigoPuntoVenta = this.datosLocalStorage.cpdv as number;
        this.codigoSucursal = this.datosLocalStorage.cs as number;
        this.usuario = this.datosLocalStorage.nu as string;

        this.factura.usuario = this.usuario;
        this.factura.codigopuntoventa = this.codigoPuntoVenta;
        this.factura.codigosucursal = this.codigoSucursal;
    
    }
  }

  // Metodos encargados a el cargado de listas
  cargarListas(){
    this.cargarListaProductos();
    this.cargarListaClientes();
  }

  cargarListaProductos(){
    this.productsService.obtenerLista(this.token).subscribe(lista => {
      this.listaProductos = lista as Producto[]
    })
  }

  cargarListaClientes(){
    this.clientsPhoneService.obtenerLista(this.token).subscribe(lista => {
      this.listaTelefonosClientes = lista as TelefonoCliente[]
    })
  }

  // Metodos encargados de buscar los datos del cliente
  buscar(){
  
    let telefonoIngresado = this.factura.codigotelefonoclienteNavigation.telefono;

    if( telefonoIngresado > 6630001){
      let indiceElemento = this.buscarSocio(telefonoIngresado);
      if (indiceElemento != -1) {

        let cliente = this.listaTelefonosClientes[indiceElemento];

        // Guardando el codigo del cliente en la variable del cliente 
        this.factura.codigotelefonoclienteNavigation.codigotelefonocliente = cliente.codigotelefonocliente;
        
        // Pero para la factura no se mostrara el codigotelefonocliente sino el telefono
        this.factura.codigotelefonocliente = cliente.telefono + "";
        this.factura.nombrerazonsocial = cliente.razonsocial;
        this.factura.codigotipodocumentoidentidad = cliente.codigotipodocumentoidentidad;

        if(cliente.codigotipodocumentoidentidad == 5){
          this.factura.numerodocumento = cliente.nit.trim();
        }else{
          this.factura.numerodocumento = cliente.ci.trim();
          this.factura.complemento = cliente.complemento;
        }
      
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail:'No se pudo encontrar un cliente con ese numero de telefono.'});
      }
    }
    else{
      this.messageService.add({severity:'error', summary: 'Error', detail:'El numero de telefono ingresado es invalido.'});
    }
  }

  buscarSocio(telefono: number): number {
    let index = -1;
    for (let i = 0; i < this.listaTelefonosClientes.length; i++) {
      if (this.listaTelefonosClientes[i].telefono == telefono) {
          index = i;
          break;
      }
    }
    return index;
  }


  inicializarProducto(){
    this.producto = {
      codigoproducto : "",
      nombreproducto : '',
      tipoproducto : '',
      precio : 0,
      codigounidadmedida : '0',
      codigocategoria : 0,
      activo : true,
      codigocategoriaNavigation: {
        codigocategoria : 0,
        codigoactividad : 0,
        codigoproductosin : 0,
        descripcionproducto : "",
        activo : true,
        productos : []
      },
      facturadetalles : []
    }
  }


  // Metodos encargados de la administracion de los facturas
  inicializarFactura(){
    this.factura = {
      codigofactura : 0,
      codigorecepcion: '0',
      nitemisor: 0,
      municipio: '',
      telefonoemisor: 0,
      nitconjunto: '',
      numerofactura: 1,
      cuf: '',
      cufd: '',
      codigosucursal: this.codigoSucursal,
      direccion: '',
      codigopuntoventa: this.codigoPuntoVenta,
      cafc: '',
      fechaemision: new Date(),
      nombrerazonsocial: '',
      codigotipodocumentoidentidad: 0,
      numerodocumento: '',
      complemento: '',
      codigotelefonocliente: '0',
      codigometodopago: 0, //Se sacará de la tabla parametros
      nrotarjeta: 0,
      montototal: 0,
      montototalsujetoiva: 0,
      codigomoneda: 0, //Se sacará de la tabla parametros
      leyenda: '',
      usuario: this.usuario,
      codigodocumentosector: 0, //  Se sacará de la tabla parametros 1 o 22
      estadoFactura: '',
      descuentoadicional : 0,
      facturadetalles : [],
      codigotelefonoclienteNavigation : {
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
    };
  }

  // Metodos encargados de la administracion de los detalles 
  inicializarDetalle(){
    this.detalle = {
      codigofacturadetalle: 0,
      codigofactura: 0,
      codigoproducto: '',
      actividadeconomica: '',
      codigoproductosin: 0,
      descripcion: '',
      cantidad: 0,
      unidadmedida: 0,
      preciounitario: 0,
      montodescuento: 0,
      subtotal: 0,
      cuenta: '',
      numeroSerie: '',
      numeroImei: '',
      codigoGrupo: '',
    }
  }

  agregarDetalle(){

    if(this.detalle.cantidad > 0 ){
      // Cargando los datos del producto al detalle

      this.detalle = {
        codigofacturadetalle: 0,
        codigofactura: this.factura.codigofactura,
        codigoproducto: this.producto.codigoproducto,
        actividadeconomica: this.producto.codigocategoriaNavigation.codigoactividad+"",
        codigoproductosin: this.producto.codigocategoriaNavigation.codigoproductosin,
        descripcion: this.producto.nombreproducto,
        cantidad: this.detalle.cantidad,
        unidadmedida: +this.producto.codigounidadmedida,
        preciounitario: this.producto.precio,
        montodescuento: 0,
        subtotal: this.detalle.cantidad * this.producto.precio,
        cuenta: '',
        numeroSerie: '',
        numeroImei: '',
        codigoGrupo: ''
      }
      
      let indice = this.buscarDetalle(this.detalle);
      if(indice >= 0){
        this.messageService.add({severity:'error', summary: 'ERROR', detail:'YA EXISTE EL PRODUCTO/SERVICIO. POR FAVOR MODIFIQUE LA CANTIDAD'});
      }
      else{
          // Agregando detalle a lista de detalles 
          this.detalles.push(this.detalle);
          this.calcularTotal();
          this.inicializarDetalle();
          this.messageService.add({severity:'success', summary: 'ERROR', detail:'EL REGISTRO FUE AGREGADO CORRECTAMENTE.'});
      }
    }else{
      this.messageService.add({severity:'error', summary: 'ERROR', detail:'LA CANTIDAD DEL PRODUCTO/SERVICIO DEBE SER MAYOR A CERO'});
    }
  } 

  abrirModalEliminarDato(detalle: Detalle) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere eliminar el detalle ' + detalle.descripcion + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        accept: () => {
            this.borrarDetalle(detalle);
        }
    });
  }

  borrarDetalle(detalle : Detalle){
    let indiceDetalleEliminar = this.buscarDetalle(detalle);
    if(indiceDetalleEliminar >=0){
      this.detalles.splice(indiceDetalleEliminar,1);
      this.calcularTotal();
      this.messageService.add({severity:'warn', summary: 'EXITO', detail:'EL REGISTRO FUE ELIMINADO CORRECTAMENTE.'});
    }
  }

  buscarDetalle(detalle: Detalle){
    let indice = -1;
    if (detalle.cantidad > 0) {
      this.detalles.forEach((item:Detalle, index) =>{
        if(item.codigoproducto === detalle.codigoproducto){
           indice = index;
        }
      });
    }
    return indice;
  }

  calcularTotal(){
    //Calculamos el TOTAL 
    this.factura.montototal = 0;
    this.detalles.forEach(detalle => {
      this.factura.montototal = this.factura.montototal + detalle.subtotal; 
    });
    
    this.descuentoT = ((this.factura.descuentoadicional)/100) * this.factura.montototal;
    if(this.factura.descuentoadicional >=0 && this.factura.descuentoadicional < 100){
        this.factura.montototal = this.factura.montototal - this.descuentoT;
    }
    else if(this.factura.descuentoadicional == 99){
      this.messageService.add({
        severity:'error', 
        summary: 'ERROR', 
        detail:'EL DESCUENTO ADICIONAL NO PUEDE SER 100%'
      }); 
    }
  }

  habilitarEdicionDetalle() {
    this.clonDetalles = {...this.detalles};
  }

  confirmarEdicionDetalle(detalle: Detalle) {
    let indice = this.buscarDetalle(detalle);

    let descuento = (detalle.montodescuento/100) * detalle.cantidad*detalle.preciounitario;
    if (detalle.cantidad > 0 && descuento >= 0 && detalle.montodescuento< 100) {
      this.detalles[indice].subtotal = (detalle.cantidad*detalle.preciounitario)-descuento;
      detalle.subtotal = (detalle.cantidad*detalle.preciounitario)-descuento;
      this.messageService.add({severity:'success', summary: 'EXITO', detail:'EL REGISTRO FUE EDITADO CORRECTAMENTE.'});
      this.calcularTotal();
    }  
    else {
       if(detalle.cantidad > 0 && descuento >= 100){
         detalle.montodescuento = 0;
         this.calcularTotal();
         this.messageService.add({severity:'error', summary: 'ERROR', detail:'EL DESCUENTO NO PUEDE SER MAYOR AL 100%'}); 
       }
       else
        if(detalle.cantidad > 0 && descuento < 0){
          detalle.montodescuento = 0;
          this.calcularTotal();
          this.messageService.add({severity:'error', summary: 'ERROR', detail:'EL DESCUENTO NO PUEDE SER NEGATIVO'});
        }
        else{
          detalle.cantidad=1;
          detalle.montodescuento = 0;
          detalle.subtotal = detalle.preciounitario;
          this.calcularTotal();
          this.messageService.add({severity:'error', summary: 'ERROR', detail:'LA CANTIDAD DEL PRODUCTO/SERVICIO DEBE SER MAYOR A CERO'});
        }
      }
  }

  cancelarEdicionDetalle(detalle: Detalle) {
    let indice = this.buscarDetalle(detalle);
    this.estaEditando = false;
    this.detalles = {...this.clonDetalles};
  }

  generarFactura(){

    this.actualizarVariablesGlobales();

    if( this.validarDatosFactura() && this.validarDatosGenerales()){//Verificar cual será la condición para generar la factura sin problemas

      this.factura.descuentoadicional = this.descuentoT;

      this.cargando = true;
      this.mensajeCarga = "Guardando Factura en la Base de Datos...";
      // Cargando Cabecera
      this.facturaService.agregar(this.token,this.factura).subscribe(factura =>{

        this.mensajeCarga = "Guardando Detalle de Factura en la Base de Datos...";

        let xfactura = factura as Factura;

        // Cargando Detalles
        if (this.facturaService.cargarDatosDetalleDto(this.token,this.detalles, xfactura.codigofactura)){
          
          this.mensajeCarga = "Enviando Factura al Sistema de Impuestos Nacionales..."
          // Enviando a impuestos
          this.facturaService.enviarFacturaImpuestos(this.token, xfactura.codigopuntoventa, xfactura.codigofactura, xfactura.codigodocumentosector, xfactura.codigosucursal).subscribe(xrespuesta =>{

            let respuesta : RespuestaRecepcion = xrespuesta as RespuestaRecepcion;

            if(respuesta.codigoDescripcion == 'VALIDADA'){
              this.messageService.add({
                severity:'success',
                  summary: 'EXITO', 
                  detail: 'FACTURA GENERADA Y REGISTRADA EN EL SIN',
                  life: 3000
                });
                
                this.cargando = false;
            }else if(respuesta.codigoDescripcion == 'RECHAZADA'){

              let listaMensajeError : string = '';

              if(respuesta.mensajesList != null){
                respuesta.mensajesList.forEach(element => {
                  listaMensajeError = listaMensajeError + element.descripcion;
                });
              }

              this.messageService.add({
                severity:'error', 
                summary: 'ERROR', 
                detail: 'LA FACTURA FUE RECHAZADA POR EL SIN: ' + listaMensajeError,
                sticky: true
              });

              this.facturaService.registrarFacturaRechazada(this.token,xfactura.codigofactura).subscribe(data =>{
                this.messageService.add({
                  severity:'error', 
                  summary: 'ERROR', 
                  detail: 'LA FACTURA FUE REGISTRADA COMO RECHAZADA POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE',
                  sticky: true
                });
              });

              this.cargando = false;
            }
            else
            if(respuesta.codigoEstado=52){
              this.messageService.add({
                severity:'error', 
                summary: 'ERROR', 
                detail: respuesta.codigoDescripcion,
                sticky: true
              });

              this.facturaService.registrarFacturaRechazada(this.token,xfactura.codigofactura).subscribe(data =>{
                this.messageService.add({
                  severity:'error', 
                  summary: 'ERROR', 
                  detail: 'LA FACTURA FUE REGISTRADA COMO RECHAZADA POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE',
                  sticky: true
                });
              });

              this.cargando = false;
            }
          }, error =>{
            this.messageService.add({
              severity:'error', 
              summary: 'ERROR', 
              detail: 'OCURRIO UN ERROR A LA HORA DE ENVIAR LA FACTURA AL SIN',
              sticky: true
            });

            this.cargando = false;

            this.facturaService.registrarFacturaRechazada(this.token,xfactura.codigofactura).subscribe(data =>{
              this.messageService.add({
                severity:'error', 
                summary: 'ERROR', 
                detail: 'LA FACTURA FUE REGISTRADA COMO RECHAZADA POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE',
                sticky: true
              });
            });

            
          });

          this.inicializarDetalle();
          this.inicializarFactura();
          this.inicializarProducto();
          this.detalles = []
        }
        else{
          this.messageService.add({
            severity:'error',
            summary: 'ERROR',
            detail: 'OCURRIO UN ERROR AL GUARDAR EL DETALLE DE LA FACTURA EL LA BASE DE DATOS, POR FAVOR VERIFIQUE LA FACTURA GENERADA.',
            sticky : true
          });

          this.cargando = false;

          this.facturaService.registrarFacturaRechazada(this.token,xfactura.codigofactura).subscribe(data =>{
            this.messageService.add({
              severity:'error', 
              summary: 'ERROR', 
              detail: 'LA FACTURA FUE REGISTRADA COMO RECHAZADA POR FAVOR VERIFIQUE LOS DATOS E INTENTE NUEVAMENTE',
              sticky: true
            });
          })
        }

      },
      error => {
        this.messageService.add({
          severity:'error', 
          summary: 'ERROR', 
          detail: 'OCURRIO UN ERROR AL GUARDAR SU FACTURA EL LA BASE DE DATOS, POR FAVOR VERIFIQUE LOS DATOS DE LA FACTURA E INTENTE NUEVAMENTE',
          sticky: true
        });

        this.cargando = false;
      });  
    }else if(!this.validarDatosGenerales()){
      this.messageService.add({
        severity:'error',
        summary: 'ERROR',
        detail: 'POR FAVOR SELECCIONE UN PUNTO DE VENTA.',
      });
    }else if(!this.validarDatosFactura()){
      this.messageService.add({
        severity:'error',
        summary: 'ERROR',
        detail: 'POR FAVOR VERIFIQUE LOS DATOS DE LA FACTURA.',
      });
    }
  }

  validarDatosFactura():boolean{
    return (+this.factura.codigotelefonocliente >6630001 && this.factura.montototal > 0);
  }

  validarDatosGenerales(): boolean{
    return !( this.codigoPuntoVenta == -1 || this.codigoSucursal == -1 || this.usuario === "")
  }

}

