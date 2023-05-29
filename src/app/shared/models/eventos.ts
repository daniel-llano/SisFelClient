import { Parametro } from "./parametro";

export interface Evento{
    codigoevento: number;
    codigomotivoevento: string;
    codigorecepcionevento: number;
    codigopuntoventa: number;
    cafccompraventa: string;
    cafctelecom: string;
    cuis: string;
    cufd: string;
    cufdevento: string;
    descripcion: string;
    fechahorainicioevento: Date;
    fechafinevento: Date;
    activo: boolean;
    //codigomotivoeventoNavigation : Parametro
}