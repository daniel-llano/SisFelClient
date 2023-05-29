import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { General } from 'src/app/shared/models/general';
import { CompanyDataService } from '../../services/company-data/company-data.service';

@Component({
  selector: 'app-company-data',
  templateUrl: './company-data.component.html',
  styleUrls: ['./company-data.component.css']
})
export class CompanyDataComponent implements OnInit {

  listaDatosGenerales! : General[];

  // Datos Generales
  token! : string;
  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor(private companyDataService : CompanyDataService,private primengConfig: PrimeNGConfig) { }

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
    this.companyDataService.obtenerLista(this.token).subscribe(lista => {
      this.listaDatosGenerales = lista as General[];
      this.listaDatosGenerales = this.listaDatosGenerales.slice(0,1);
    })
  }
}
