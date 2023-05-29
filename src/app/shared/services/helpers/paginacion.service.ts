import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filtro } from '../../models/helpers/filtro';

@Injectable({
  providedIn: 'root'
})
export class PaginacionService {
  Filtro : Filtro= new Filtro ;

  httpOptions ={
    headers: new HttpHeaders(
      {
          'Content-Type':'application/json; charset=utf-8',
      })
  };

  constructor() {
    this.Filtro.filter="";
    this.Filtro.PageNumber=1;
    this.Filtro.PageSize=5;
   }
}
