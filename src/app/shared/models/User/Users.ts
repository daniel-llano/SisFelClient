import { AuditoriaFacturas } from "../auditoriafacturas";
import { Factura } from "../factura";
import { Rol } from "./../rol";

export interface Users{
    nombreusuario : string,
    ci : string;
    nombres : string;
    ap : string;
    am : string;
    telefono : string;
    clave : string;
    codigorol : number;
    activo : boolean
    auditoriafacturas:AuditoriaFacturas;
    codigorolnavigation:Rol;
    facturas:Factura
}