export interface FacturaDto{
  codigofactura : number;
  codigorecepcion : string;
  nitemisor: number;
  municipio: string;
  telefonoemisor: number;
  nitconjunto: string;
  numerofactura: number;
  cuf: string;
  cufd: string;
  codigosucursal: number;
  direccion: string;
  codigopuntoventa: number;
  cafc: string;
  //fechaemision: Date;
  nombrerazonsocial: string;
  codigotipodocumentoidentidad: number;
  numerodocumento: string;
  complemento: string;
  codigotelefonocliente: string;
  codigometodopago: number; //Se sacará de la tabla parametros
  nrotarjeta: number;
  montototal: number;
  montototalsujetoiva: number;
  codigomoneda: number; //Se sacará de la tabla parametros
  leyenda: string;
  usuario: string;
  codigodocumentosector: number; //  Se sacará de la tabla parametros 1 o 22
  estadoFactura: string;
  descuentoadicional : number;
}