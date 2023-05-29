import { Categoria } from "./categoria";

export interface Producto{
    codigoproducto : string,
    nombreproducto : string,
    tipoproducto : string,
    precio : number,
    codigounidadmedida : string,
    codigocategoria : number,
    activo : any,
    codigocategoriaNavigation : Categoria,
    facturadetalles : []
}