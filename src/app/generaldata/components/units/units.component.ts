import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { UnidadMedida } from 'src/app/shared/models/unidadMedida';
import { UnitsService } from '../../services/units/units.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
})
export class UnitsComponent implements OnInit {

  listaUnidades! : UnidadMedida[];

  // Datos Generales
  token! : string;
  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor(private unitsService : UnitsService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    
    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
    };

    if(this.token!= null){
      this.cargarListas();
    }
  }

  cargarListas(){
    this.unitsService.obtenerLista(this.token).subscribe(lista => {
      this.listaUnidades = lista as UnidadMedida[];
    })
  }
}
