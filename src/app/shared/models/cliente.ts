import { TelefonoCliente } from "./telefonocliente"

export interface Cliente{
    codigocliente : string,
    datoscliente : string,
    ci : string,
    tipopersona : string,
    activo : boolean
    telefonoclientes : TelefonoCliente[]
}