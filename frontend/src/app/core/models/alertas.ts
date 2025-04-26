// import { BaseModel } from '../../common/baseModel';

// export class Alerta extends BaseModel {
//   id_pacientes: string;
//   hora: string;
//   estado: string;
//   tipo?: string;
//   confirmada_por?: string;
//   fecha_confirmacion?: string;

//   constructor(
//     id: number,
//     id_pacientes: string,
//     hora: string,
//     estado: string,
//     tipo?: string,
//     confirmada_por?: string,
//     fecha_confirmacion?: string
//   ) {
//     super(id);
//     this.id_pacientes = id_pacientes;
//     this.hora = hora;
//     this.estado = estado;
//     this.tipo = tipo ?? '';
//     this.confirmada_por = confirmada_por ?? '';
//     this.fecha_confirmacion = fecha_confirmacion ?? '';
//   }
// }

import { BaseModel } from '../../common/baseModel';

export class Alerta extends BaseModel {
  id_pacientes: string;
  hora: string;
  estado: string;
  tipo?: string;
  confirmada_por?: string;
  fecha_confirmacion?: string;
  paciente?: PacienteMini;

  constructor(
    id: number,
    id_pacientes: string,
    hora: string,
    estado: string,
    tipo?: string,
    confirmada_por?: string,
    fecha_confirmacion?: string,
    paciente?: PacienteMini
  ) {
    super(id);
    this.id_pacientes = id_pacientes;
    this.hora = hora;
    this.estado = estado;
    this.tipo = tipo ?? '';
    this.confirmada_por = confirmada_por ?? '';
    this.fecha_confirmacion = fecha_confirmacion ?? '';
    this.paciente = paciente;
  }
}

export interface PacienteMini {
  nombre_completo: string;
  foto_url: string;
  habitacion: string;
  edad: number;
}
