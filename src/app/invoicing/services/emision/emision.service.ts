import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Factura } from 'src/app/shared/models/factura';
import { FacturaDto } from 'src/app/shared/models/Dtos/facturaDto';
import { FacturaDetalleDto } from 'src/app/shared/models/Dtos/facturaDetalleDto';
import { Detalle } from 'src/app/shared/models/detalle';

// Observable
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmisionService {

  //Base para conexion proxy
  private baseUrl = '/api/Factura';
  private baseUrl1 = '/api/FacturaDetalle';

  private factura : Factura = {
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
    usuario: '',
    codigodocumentosector: 1, //  Se sacará de la tabla parametros 1 o 22
    estadoFactura: 'PENDIENTE',
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

  constructor(private http : HttpClient) { }

  obtenerFactura(){
    return this.factura;
  }

  cargarFactura(xfactura: Factura){
    this.factura = {... xfactura};
  }

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
      usuario: '',
      codigodocumentosector: 1, //  Se sacará de la tabla parametros 1 o 22
      estadoFactura: 'PENDIENTE',
      descuentoadicional : 0,
      facturadetalles : [],
      codigotelefonoclienteNavigation : {
        codigotelefonocliente : '',
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
  
  agregar(token : string, factura : Factura){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let url = this.baseUrl + '/agregar';
    let facturaDto : FacturaDto = this.cargarDatosDto(factura);
    return this.http.post( url, facturaDto, {headers : httpHeaders});
  }

  cargarDatosDto(factura : Factura) : FacturaDto{
    let facturaDto : FacturaDto = {
      codigorecepcion : factura.codigorecepcion,
      codigofactura : factura.codigofactura,
      nitemisor: factura.nitemisor,
      municipio: factura.municipio,
      telefonoemisor: factura.telefonoemisor,
      nitconjunto: factura.nitconjunto,
      numerofactura: factura.numerofactura,
      cuf: factura.cuf,
      cufd: factura.cufd,
      codigosucursal: factura.codigosucursal,
      direccion: factura.direccion,
      codigopuntoventa: factura.codigopuntoventa,
      cafc: factura.cafc,
    // fechaemision: new Date(),
      nombrerazonsocial : factura.nombrerazonsocial,
      codigotipodocumentoidentidad: factura.codigotipodocumentoidentidad,
      numerodocumento: factura.numerodocumento+"",
      complemento: factura.complemento,
      codigotelefonocliente : factura.codigotelefonoclienteNavigation.codigotelefonocliente,
      codigometodopago: 1, //Se sacará de la tabla parametros
      nrotarjeta: 0,
      montototal: factura.montototal,
      montototalsujetoiva: factura.montototal,
      codigomoneda: 1, //Se sacará de la tabla parametros
      leyenda: factura.leyenda,
      usuario: factura.usuario,
      codigodocumentosector: factura.codigodocumentosector,
      estadoFactura: factura.estadoFactura,  
      descuentoadicional: factura.descuentoadicional
    }
    return facturaDto;
  }

  agregarDetalle(token : string, detalle : FacturaDetalleDto){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let url = this.baseUrl1 + '/agregar';
    return this.http.post( url, detalle, {headers : httpHeaders});

  }

  enviarFacturaImpuestos(token : string, codigoPuntoVenta: number, codigoFactura: number, codigoDocumentoSector : number, codigoSucursal : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    if(codigoDocumentoSector == 1){
      let url = this.baseUrl + '/enviarFacturaImpuestosCompraVenta' + '?codigoPuntoVenta=' + codigoPuntoVenta + '&codigoFactura=' + codigoFactura + '&codigoDocumentoSector=' + codigoDocumentoSector + '&codigoSucursal=' + codigoSucursal;  
      return this.http.post(url, 1, {headers: httpHeaders });
    }
    
    if(codigoDocumentoSector == 22){
      let url = this.baseUrl + '/enviarFacturaImpuestosTelecom' + '?codigoPuntoVenta=' + codigoPuntoVenta + '&codigoFactura=' + codigoFactura + '&codigoDocumentoSector=' + codigoDocumentoSector + '&codigoSucursal=' + codigoSucursal;
      return this.http.post(url, 1, {headers: httpHeaders });
    }
    // Se espera que nunca llegue
    let url = this.baseUrl + '/enviarFacturaImpuestosCompraVenta' + '?codigoPuntoVenta=' + codigoPuntoVenta + '&codigoFactura=' + codigoFactura + '&codigoDocumentoSector=' + codigoDocumentoSector + '&codigoSucursal=' + codigoSucursal;  
    return this.http.post(url, 1, {headers: httpHeaders });
  }

  registrarFacturaRechazada(token : string, codigoFactura : number){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoFactura=' + codigoFactura + '&estado=RECHAZADA';
    //Llamada API enviando el token
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  cargarDatosDetalleDto(token : string, facturaDetalle : Detalle[],id_factura: number) : boolean{
    let bandera = true;
    for(let i= 0; i < facturaDetalle.length && bandera==true;i++){
      let facturaDetalleDto : FacturaDetalleDto = {
        codigofacturadetalle : facturaDetalle[i].codigofacturadetalle,
        codigofactura: id_factura,
        codigoproducto: facturaDetalle[i].codigoproducto,
        actividadeconomica: facturaDetalle[i].actividadeconomica,
        codigoproductosin: facturaDetalle[i].codigoproductosin,
        descripcion: facturaDetalle[i].descripcion,
        cantidad: facturaDetalle[i].cantidad,
        unidadmedida: facturaDetalle[i].unidadmedida, 
        preciounitario: facturaDetalle[i].preciounitario,
        montodescuento: (facturaDetalle[i].cantidad*facturaDetalle[i].preciounitario)*(facturaDetalle[i].montodescuento)/100,
        subtotal: facturaDetalle[i].subtotal,
        cuenta: facturaDetalle[i].cuenta,
        numeroserie: '0',
        numeroimei: '0',
        codigogrupo: '' 
      }

      this.agregarDetalle(token, facturaDetalleDto).subscribe(detalle =>{
        if(detalle == null)
          bandera = false;
      },
      error =>{
        bandera = false;
      });
    }
  return bandera;
  }
}