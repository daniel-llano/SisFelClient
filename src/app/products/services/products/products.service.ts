import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from 'src/app/shared/models/product';
import { ProductoDto } from 'src/app/shared/models/Dtos/productDto';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  //Base para conexion proxy
  baseUrl = '/api/Producto';

  constructor(private http : HttpClient, private PaginacionService : PaginacionService) { }

  obtenerLista(token : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/lista';
    return this.http.get(url, {headers : httpHeaders});
  }

  listaPaginada(token:string, filtroEstado : boolean){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let url = this.baseUrl + '/listaPaginada' + '?filter=' + this.PaginacionService.Filtro.filter +
    '&PageSize=' + this.PaginacionService.Filtro.PageSize +
    '&PageNumber=' + this.PaginacionService.Filtro.PageNumber +
    '&activo=' + filtroEstado;
    return this.http.get( url,{headers : httpHeaders});
  }

  agregar(token : string, producto : Producto){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/agregar';
    let productoDto : ProductoDto = this.cargarDatosDto(producto);
    return this.http.post( url, productoDto, {headers : httpHeaders});
  }

  modificar(token : string, producto : Producto){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/modificar';
    let productoDto : ProductoDto = this.cargarDatosDto(producto);
    return this.http.put(url, productoDto, {headers : httpHeaders});
  }

  eliminar(token : string, codigoProducto : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoProducto=' + codigoProducto + '&estado=' + false;
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  habilitar(token : string, codigoProducto : string){
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = this.baseUrl + '/cambio de estado' + '?CodigoProducto=' + codigoProducto + '&estado=' + true;
    return this.http.put(url, 1, {headers : httpHeaders});
  }

  cargarDatosDto(producto : Producto) : ProductoDto{
    let productoDto : ProductoDto = {
      codigoproducto : producto.codigoproducto,
      nombreproducto : producto.nombreproducto,
      codigocategoria : producto.codigocategoria,
      codigounidadmedida : +producto.codigounidadmedida,
      tipoproducto : producto.tipoproducto,
      precio : producto.precio,
      activo : producto.activo
    }
    return productoDto;
  }
  
}
