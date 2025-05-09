import { BaseModel } from '../../common/baseModel';

export class Bitacora extends BaseModel {
  id_alerta: number;
  accion: string;
  usuario: string;
  descripcion: string;
  fecha_accion: string;
  alerta?: AlertaMini;

  constructor(
    id: number,
    id_alerta: number,
    accion: string,
    usuario: string,
    descripcion: string,
    fecha_accion: string,
    alerta?: AlertaMini
  ) {
    super(id);
    this.id_alerta = id_alerta;
    this.accion = accion;
    this.usuario = usuario;
    this.descripcion = descripcion;
    this.fecha_accion = fecha_accion;
    this.alerta = alerta ?? undefined;
  }
}

export interface AlertaMini {
  id_paciente: string;
  tipo?: string;
  estado: string;
  fecha?: string;
  nueva?: boolean;
  palabras_clave?: string[];
  paciente?: PacienteMini;
}

export interface PacienteMini {
  nombre_completo: string;
  foto_url: string;
  habitacion: string;
  edad: number;
  diagnostico: string;
}
