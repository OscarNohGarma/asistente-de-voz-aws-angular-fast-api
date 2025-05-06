import { BaseModel } from '../../common/baseModel';

export class Paciente extends BaseModel {
  nombre_completo: string;
  foto_url: string;
  edad: number;
  habitacion: string;
  diagnostico: string;
  fecha_ingreso: string;
  activo: boolean;
  telefono_familiar?: string; // Se marca como opcional
  correo_familiar?: string; // Se marca como opcional

  constructor(
    id: number,
    nombre_completo: string,
    foto_url: string,
    edad: number,
    habitacion: string,
    diagnostico: string,
    fecha_ingreso: string,
    activo: boolean,
    telefono_familiar?: string, // Se marca como opcional
    correo_familiar?: string // Se marca como opcional
  ) {
    super(id);
    this.nombre_completo = nombre_completo;
    this.foto_url = foto_url;
    this.edad = edad;
    this.habitacion = habitacion;
    this.diagnostico = diagnostico;
    this.fecha_ingreso = fecha_ingreso;
    this.activo = activo;
    this.telefono_familiar = telefono_familiar ?? '';
    this.correo_familiar = correo_familiar ?? '';
  }
}
