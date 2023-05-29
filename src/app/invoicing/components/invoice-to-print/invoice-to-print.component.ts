import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/shared/models/factura';
import { ManagementService } from '../../services/management/management.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-invoice-to-print',
  templateUrl: './invoice-to-print.component.html',
  styleUrls: ['./invoice-to-print.component.css']
})
export class InvoiceToPrintComponent implements OnInit {

  razonSocial = "COOPERATIVA DE SERVICIOS PUBLICOS DE TELECOMUNICACIONES DE TARIJA R.L. COSETT R.";
  lugarEmision = "Tarija - Bolivia";
  enlaceQR = "https://pilotosiat.impuestos.gob.bo/consulta/QR?";
  factura$! : Observable<Factura>;
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
    usuario: '',
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

  constructor(private managementService : ManagementService) {}

  ngOnInit(): void {
    this.factura$ = this.managementService.obtenerFactura$();
    this.factura$.subscribe(factura => {
      this.factura = {...factura} as Factura;
      this.enlaceQR = this.generarEnlaceQR();
    });
  }

  generarEnlaceQR():string{
    return "https://pilotosiat.impuestos.gob.bo/consulta/QR?nit=" + "1024061022"+"&cuf="+this.factura.cuf+"&numero="+this.factura.numerofactura;
  }

  convertirNumeroLiteral(numero: number){
    let literal = this.numeroALetras(numero)
    let primerLetra = literal.substring(0,1);
    let resto = literal.substring(1, literal.length);
    return primerLetra.toUpperCase() + resto;
  }

  numeroALetras(num : number) {
    let data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: '',
        letrasMonedaPlural:  'Bolivianos',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
        letrasMonedaSingular:  'Boliviano', //'PESO', 'Dólar', 'Bolivar', 'etc'
        letrasMonedaCentavoPlural:  'Centavos',
        letrasMonedaCentavoSingular: 'Centavos'
    };

    if(data.centavos == 0){
      data.letrasCentavos = '0/100';
    }

    if (data.centavos > 0) {
        data.letrasCentavos = data.centavos + "/100"
    };

    if(data.enteros == 0)
        return 'cero ' + data.letrasCentavos;
    if (data.enteros == 1)
        return this.Millones(data.enteros) + ' ' + data.letrasCentavos;
    else
        return this.Millones(data.enteros) + ' ' + data.letrasCentavos;
  };
  
  Unidades(num : number){

    switch(num)
    {
        case 1: return 'un';
        case 2: return 'dos';
        case 3: return 'tres';
        case 4: return 'cuatro';
        case 5: return 'cinco';
        case 6: return 'seis';
        case 7: return 'siete';
        case 8: return 'ocho';
        case 9: return 'nueve';
    }

    return '';
  }//Unidades()

  Decenas(num: number){

      let decena = Math.floor(num/10);
      let unidad = num - (decena * 10);

      switch(decena)
      {
          case 1:
              switch(unidad)
              {
                  case 0: return 'diez';
                  case 1: return 'once';
                  case 2: return 'doce';
                  case 3: return 'trece';
                  case 4: return 'catorce';
                  case 5: return 'quince';
                  default: return 'dieci' + this.Unidades(unidad);
              }
          case 2:
              switch(unidad)
              {
                  case 0: return 'veinte';
                  default: return 'veinti' + this.Unidades(unidad);
              }
          case 3: return this.DecenasY('treinta', unidad);
          case 4: return this.DecenasY('cuarenta', unidad);
          case 5: return this.DecenasY('cincuenta', unidad);
          case 6: return this.DecenasY('sesenta', unidad);
          case 7: return this.DecenasY('setenta', unidad);
          case 8: return this.DecenasY('ochenta', unidad);
          case 9: return this.DecenasY('noventa', unidad);
          case 0: return this.Unidades(unidad);
      }

      return '';
  }//Unidades()

  DecenasY(strSin : string, numUnidades : number) {
      if (numUnidades > 0)
          return strSin + ' y ' + this.Unidades(numUnidades)

      return strSin;
  }//DecenasY()

  Centenas(num : number) {
      let centenas = Math.floor(num / 100);
      let decenas = num - (centenas * 100);

      switch(centenas)
      {
          case 1:
              if (decenas > 0)
                  return 'ciento ' + this.Decenas(decenas);
              return 'cien';
          case 2: return 'doscientos ' + this.Decenas(decenas);
          case 3: return 'trescientos ' + this.Decenas(decenas);
          case 4: return 'cuatrocientos ' + this.Decenas(decenas);
          case 5: return 'quinientos ' + this.Decenas(decenas);
          case 6: return 'seiscientos ' + this.Decenas(decenas);
          case 7: return 'setecientos ' + this.Decenas(decenas);
          case 8: return 'ochocientos ' + this.Decenas(decenas);
          case 9: return 'novecientos ' + this.Decenas(decenas);
      }

      return this.Decenas(decenas);
  }//Centenas()

  Seccion(num : number, divisor : number, strSingular : string, strPlural : string) {
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let letras = '';

      if (cientos > 0)
          if (cientos > 1)
              letras = this.Centenas(cientos) + ' ' + strPlural;
          else
              letras = strSingular;

      if (resto > 0)
          letras += '';

      return letras;
  }//Seccion()

  Miles(num : number) {
      let divisor = 1000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMiles = this.Seccion(num, divisor, 'un mil', 'mil');
      let strCentenas = this.Centenas(resto);

      if(strMiles == '')
          return strCentenas;

      return strMiles + ' ' + strCentenas;
  }//Miles()

  Millones(num : number) {
      let divisor = 1000000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMillones = this.Seccion(num, divisor, 'un millon de', 'millones de');
      let strMiles = this.Miles(resto);

      if(strMillones == '')
          return strMiles;

      return strMillones + ' ' + strMiles;
  }//Millones()

}
