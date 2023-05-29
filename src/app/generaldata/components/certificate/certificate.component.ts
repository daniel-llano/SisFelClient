import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Certificado } from 'src/app/shared/dtos/certificadodto';
import { RespuestaRecepcion } from 'src/app/shared/models/Impuestos/Respuestas/respuestaRecepcion';
import { CertificateService } from '../../services/certificate/certificate.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css'],
  providers: [MessageService,ConfirmationService]
})
export class CertificateComponent implements OnInit {

  listaDatosCertificado : Certificado[] = []; 

  ventanaModalRevocarCertificado : boolean = false;
  certificado : string = '';
  razon : string = '';
  intentoGuardarRevocarCertificado : boolean = false;
  fechaFinValidez : string = "";

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
    private certificateService : CertificateService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;

    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
    }

    if(this.token!= null){
      this.cargarLista();
    }
  }

  cargarLista(){
    // Recuperando datos del certificado
    this.certificateService.obtenerDatosCertificado(this.token).subscribe(datos =>{
      let certificado = datos as Certificado;
      this.fechaFinValidez = this.calcularFechaVencimiento(certificado.fechaInicio);
      certificado.fechaFinValidez = this.fechaFinValidez;
      
      this.listaDatosCertificado.push(certificado)
    });
  }

  abrirModalRevocarCertificado(){
    this.ventanaModalRevocarCertificado = true;
  }

  ocultarModalRevocarCertificado(){
    this.ventanaModalRevocarCertificado = false;
    this.intentoGuardarRevocarCertificado = false;
    this.certificado = '';
    this.razon = '';
  }

  revocarCertificado(){
    this.intentoGuardarRevocarCertificado = true;

    if(!this.validarDatos()){
      return false;      
    }else{
      this.confirmationService.confirm({
        message: '¿Está seguro que quiere revocar el certificado?',
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
  
          this.certificateService.revocarCertificado(this.token,this.certificado,this.razon, this.fechaFinValidez).subscribe( xrespuesta =>{
            respuesta = xrespuesta as RespuestaRecepcion;
  
            if(respuesta.mensajesList.length >0 ){
              let listaMensajeError : string = '';
                  respuesta.mensajesList.forEach(element => {
                    listaMensajeError = listaMensajeError + element.descripcion;
                  });
                
                  // Mostrando mensaje de error modificando atributos para que no se cierre
                  this.messageService.add({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: 'NO SE PUDO REVOCAR EL CERTIFICADO: ' + listaMensajeError,
                    sticky : true
                  });
            }else{
              this.messageService.add({
                severity: 'success',
                summary: 'EXITO',
                detail: 'EL CERTIFICADO FUE REVOCADO CORRECTAMENTE',
              });
            }
          });
          this.ocultarModalRevocarCertificado();
          
        }
      });

      return true;
    }
    
  }

  validarDatos(): boolean{
      return !(this.certificado == '' || this.razon == '');
  }

  calcularFechaVencimiento(fechaInicio : string ) : string{
    let año : number;
    let fechaFin = "";
    año = +fechaInicio.substring(0,4);
    fechaFin = fechaInicio.replace(año+"", (año+1)+"");
    return fechaFin;
  }
}
