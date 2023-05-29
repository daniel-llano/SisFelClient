import { Component, OnInit } from '@angular/core';
import { Masiva } from 'src/app/shared/models/masiva';
import { PrimeNGConfig } from 'primeng/api';
//services
import { MassInvoicesService } from 'src/app/invoicing/services/mass-invoices/mass-invoices.service';
//primeng
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MensajeRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/mensajeRepcion';
import { RespuestaRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/respuestaRecepcion';
import { FacturacionTelecomControllerService } from 'src/app/shared/services/impuestos/facturacionTelecomController/facturacion-telecom-controller.service';

@Component({
  selector: 'app-mass-invoices',
  templateUrl: './mass-invoices.component.html',
  styleUrls: ['./mass-invoices.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class MassInvoicesComponent implements OnInit {

   //declaracion de variables para el uso local ------ ↓
   listaObjetos!:any[];// ← lista para las facturas cargadas en base al txt
   cabecera=File; // ←	var para los archivos de texto
   detalle=File; // ←	var para los archivos de texto
   ventanaModal!: boolean;// ←	var para el modal
   txtCabecera!:File; // ←	txt cabecera
   txtDetalle!:File; // ←	txt detalle
   cargaCabecera=false; // ←	var para deshabilitar los botones de carga
   cargaDetalle=false; // ←	var para deshabilitar los botones de carga
   mostrar=false; // ←	var para el small del error
   cargadoCabecera=false; // ←	var para habilitar el boton de validar
   cargadoDetalle=false; // ←	var para habilitar el boton de validar
   validarCabecera=false; // ←	var para los archivos de texto ya validados
   validarDetalle=false; // ←	var para los archivos de texto ya validados
   nombreCabecera=""; // ←	var para almacenar el nombre del archivo cabecera
   nombreDetalle=""; // ←	var para almacenar el nombre del el archivo detalle
   progreso=false // ←	progreso para la barra de carga
   errores=false; // ←	para mostrar los errores de respuesta
   desErrores=""; // ←	Para mostrar la descripcion de los errores
   
   filtro=1;
   listaMasiva! : Masiva[];
  mostrarSalir=false;
    listaUpdate!:any;

  ventanaModalValidacionRecepcion = false;
  estadoRespuestaRecepcionMasiva = "";
  listaMensajeErrorRespuestaRecepcionMasiva : MensajeRecepcion[] =[];

  // Variables generales
  
  token! : string; // ←	var para el almacenamiento del token
  codigoSucursal : number  = -1; // ←	var para el almacenamiento de la sucursal
  codigoPuntoVenta : number = -1; // ←	var para el almacenamiento del punto de venta
  usuario : string = ''; // ←	var para el almacenamiento del usuario

  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor(
    private masivaService: MassInvoicesService,
    private facturacionTelecomControllerService : FacturacionTelecomControllerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,private primengConfig: PrimeNGConfig) 
  {
    
   }

  ngOnInit(): void {
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
      this.cargarLista();
    }
  }
  actualizarVariablesGlobales(){
    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
        this.codigoPuntoVenta = this.datosLocalStorage.cpdv as number;
        this.codigoSucursal = this.datosLocalStorage.cs as number;
        this.usuario = this.datosLocalStorage.nu as string;    
    }
  }

 //metodo para abrir el modal ------ ↓
 abrirModalNuevoDato(){
  this.ventanaModal = true;
  }
  //metodo para cerrar el modal ------ ↓
  ocultarModal(){
    this.ventanaModal = false;
    this.txtCabecera!=null;
    this.txtDetalle!=null;
    this.cargaCabecera=false;
    this.cargaDetalle=false;
    this.cargadoCabecera=false;
    this.cargadoDetalle=false;
    this.errores=false;
    this.desErrores="";
    this.progreso=false;
    this.mostrarSalir=false;
  }

  //metodo para guardar los datos ------ ↓
  cargarDatos(txtCabecera:File,txtDetalle:File){
    this.desErrores=""
    this.errores=false;
    this.mostrar=true;
    if(this.validarDatos()===true){
      if( (txtCabecera.name.substring(txtCabecera.name.length - 4, txtCabecera.name.length) != ".txt")
        || (txtDetalle.name.substring(txtDetalle.name.length - 4, txtDetalle.name.length) != ".txt") ){
          this.desErrores="LOS ARCHIVOS CARGADOS DEBEN TENER EXTENSION .txt"
          this.errores=true;
      }
      else if(txtCabecera.name===txtDetalle.name){
      this.desErrores="LOS ARCHIVOS CARGADOS TIENE EL MISMO NOMBRE"
      this.errores=true;
      }else if(txtCabecera.size===0 || txtDetalle.size===0){
        this.desErrores="UNO DE LOS ARCHIVOS CARGADOS ESTA VACIO"
        this.errores=true;
      }
      else{
        this.masivaService.cargarArchivos(this.token,txtCabecera).subscribe((resp:any)=> {
          this.cargadoCabecera=true;
          this.nombreCabecera=resp.nombre;
      })
      this.masivaService.cargarArchivos(this.token,txtDetalle).subscribe((resp:any)=> {
          this.cargadoDetalle=true;
          this.nombreDetalle=resp.nombre;
      })
      }
    
    }
  }
  //metodo para validar los datos del formulario del modal ------ ↓
  validarDatos():boolean{
    if(this.txtCabecera!=null && this.txtDetalle!=null){
      return true;
    }else{
      return false
    }
  }
  //metodo para capturar el archivo de text cabecera ------ ↓
  onChangeCabecera(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    this.txtCabecera =file;
    this.cargaCabecera=true;
  }
  //metodo para capturar el archivo de text detalle ------ ↓
  onChangeDetalle(event:any){
    const file = (event.target as HTMLInputElement).files![0];
    this.txtDetalle =file;
    this.cargaDetalle =true;
  }
  //metodo para consumir el metodo de validar del servicio ------ ↓
  validacion(cab: string, det:string){
    this.progreso=true;

    this.actualizarVariablesGlobales();

    if(this.validarDatosGenerales()){
      this.masivaService.validar(this.token,cab,det,this.codigoSucursal,this.codigoPuntoVenta,this.usuario).subscribe((resp:any)=> {
      
        if(resp.tipo===0){
  
          this.errores=true;
          var erroresLlegados=""
  
          let numeroPaquetes = resp.resp.length
          for (let index = 0; index < numeroPaquetes; index++) {
            if(index < numeroPaquetes -1)
              erroresLlegados+= (index + 1)+".-"+resp.resp[index].codigoDescripcion+", ";
            else
              erroresLlegados+= (index + 1)+".-"+resp.resp[index].codigoDescripcion+".";
          }
          this.desErrores=erroresLlegados;
          this.progreso=false;
          this.listaUpdate=resp.obj;
          this.mostrarSalir=true;
        }else if(resp.tipo===1){
          this.errores=true;
          this.desErrores=resp.erroresDetalle[0];
          this.progreso=false;
        }else if(resp.tipo===2){
          this.errores=true;
          this.desErrores=resp.erroresCabecera[0];
          this.progreso=false;
        }
      });
    }else{
      this.progreso=false;
      this.messageService.add({
        severity:'error',
        summary: 'ERROR',
        detail: 'POR FAVOR SELECCIONE UN PUNTO DE VENTA.',
      });
    } 
  }

  cargarLista(){
    this.masivaService.obtenerLista(this.token,this.filtro).subscribe((resp:any)=> {
      this.listaMasiva = resp as Masiva[];
    })
  }

  salir(){
      this.cargarLista();
      this.ocultarModal();
  }

  validacionRecepcionMasiva(obj : any){
    let respuesta : RespuestaRecepcion = {
      codigoDescripcion : '',
      codigoEstado : 1,
      codigoRecepcion : '',
      mensajesList : [],
      transaccionField : true
    }

    this.facturacionTelecomControllerService.validacionRecepcionMasiva(this.token,obj.codigorecepcion).subscribe(xrespuesta =>{
      respuesta = xrespuesta as RespuestaRecepcion
      
      this.estadoRespuestaRecepcionMasiva = respuesta.codigoDescripcion;

      this.listaMensajeErrorRespuestaRecepcionMasiva = respuesta.mensajesList;

      if(respuesta.codigoDescripcion == "VALIDADA" && obj.estado != 1){
        obj.estado = 1;
        this.masivaService.actualizarMasiva(this.token, obj).subscribe(respuesta =>{
          
        })
      }else if(respuesta.codigoDescripcion == "OBSERVADA" && obj.estado != 2){
        obj.estado = 2;
        this.masivaService.actualizarMasiva(this.token, obj).subscribe(respuesta =>{
          
        })
      }else if(respuesta.codigoDescripcion == "RECHAZADA" && obj.estado != 4 && respuesta.mensajesList[0].codigo == 902){
        obj.codigorecepcion = "0";
        obj.estado = 4;
        this.masivaService.actualizarMasiva(this.token, obj).subscribe(respuesta =>{
        })
      }
      this.cargarLista();
      this.abrirModalValidacionRecepcion();
    })  
  }

  
  abrirModalValidacionRecepcion(){
    this.ventanaModalValidacionRecepcion = true;
    this.cargarLista();
  }
  
  ocultarModalValidacionRecepcion(){
    this.ventanaModalValidacionRecepcion = false;
    this.listaMensajeErrorRespuestaRecepcionMasiva = [];
    this.estadoRespuestaRecepcionMasiva = "";
  }

  validarDatosGenerales(): boolean{
    return !( this.codigoPuntoVenta == -1 || this.codigoSucursal == -1 || this.usuario === "")
  }
}
