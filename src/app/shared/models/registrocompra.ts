export interface RegistroCompra {
    codigocompra : number;
    nrocompra : number;
    nitemisor : number;
    razonsocialemisor : string;
    codigoautorizacion : string;
    numerofactura: number;
    numeroduidim : string;
    fechaemision : Date;
    montototalcompra : number; 
    importeice : number; 
    importeiehd : number; 
    importeipj : number; 
    tasas : number;
    otronosujetocredito : number;
    importesexentos : number;
    importetasacero : number;
    subtotal : number;
    descuento : number;
    montogiftcard : number;
    montototalsujetoiva : number;
    creditofiscal : number;
    tipocompra : string;
    codigocontrol : string; 
}