import { BaseModel } from '../../common/baseModel';

export class Alerta extends BaseModel {
  id_pacientes: string;
  hora: string;
  estado: string;
  tipo?: string;
  confirmada_por?: string;
  fecha_confirmacion?: string;
  paciente?: PacienteMini;
  nueva?: boolean;
  palabras_clave?: string[];

  constructor(
    id: number,
    id_pacientes: string,
    hora: string,
    estado: string,
    tipo?: string,
    confirmada_por?: string,
    fecha_confirmacion?: string,
    paciente?: PacienteMini,
    nueva?: boolean,
    palabras_clave?: string[]
  ) {
    super(id);
    this.id_pacientes = id_pacientes;
    this.hora = hora;
    this.estado = estado;
    this.tipo = tipo ?? '';
    this.confirmada_por = confirmada_por ?? '';
    this.fecha_confirmacion = fecha_confirmacion ?? '';
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
