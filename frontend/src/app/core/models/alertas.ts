import { BaseModel } from '../../common/baseModel';

export class Alerta extends BaseModel {
  id_paciente: string;
  estado: string;
  tipo?: string;
  fecha?: string;
  paciente?: PacienteMini;
  nueva?: boolean;
  palabras_clave?: string[];

  constructor(
    id: number,
    id_paciente: string,
    estado: string,
    tipo?: string,
    fecha?: string,
    paciente?: PacienteMini,
    nueva?: boolean,
    palabras_clave?: string[]
  ) {
    super(id);
    this.id_paciente = id_paciente;
    this.estado = estado;
    this.tipo = tipo ?? '';
    this.fecha = fecha ?? '';
    this.paciente = paciente;
    this.nueva = nueva ?? true; // por defecto nueva en true
    this.palabras_clave = palabras_clave ?? [];
  }
}

export interface PacienteMini {
  nombre_completo: string;
  foto_url: string;
  habitacion: string;
  edad: number;
  diagnostico: string;
}
