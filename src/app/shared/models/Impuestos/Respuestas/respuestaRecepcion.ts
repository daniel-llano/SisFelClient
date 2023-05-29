import { MensajeRecepcion } from "./mensajeRepcion";

export interface RespuestaRecepcion {
    codigoDescripcion : string;
    codigoEstado : number;
    codigoRecepcion : string;
    mensajesList : MensajeRecepcion[];
    transaccionField : boolean;
}