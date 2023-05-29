
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MassInvoicesService {
 //Base para conexion proxy
 baseUrl = '/api/FacturacionMasiva';
  constructor(private http : HttpClient) { }
  
  cargarArchivos(token : string, file:Blob){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    const formData = new FormData();
    formData.append('file',file)
    let url = this.baseUrl + '/agregarTxt';
    return this.http.post(url,formData);
  }


  validar(token : string,cab:string, det:string, sucursal:number, puntoVenta:number, usuario:string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/valida'+ '?nombreCab=' + cab + '&nombreDet=' + det +'&sucursal=' + sucursal +'&puntoVenta=' + puntoVenta +'&usuario=' + usuario;
    return this.http.get(url, {headers : httpHeaders});
  }

  obtenerLista(token : string, estado:number){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    let url = this.baseUrl + '/lista';
    if(estado>0){
      url=this.baseUrl + '/lista'+ '?estado=' + estado;
    }
    return this.http.get(url, {headers : httpHeaders});
  }

  actualizarMasiva(token : string, obj : any){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';
    return this.http.put(url, obj, {headers : httpHeaders});
  }

}
