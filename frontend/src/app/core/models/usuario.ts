import { BaseModel } from '../../common/baseModel';

export class Usuario extends BaseModel {
  nombre_completo: string;
  correo: string;
  contrasena: string;
  rol: string;
  fecha_creacion: string;
  activo: boolean;

  constructor(
    id: number,
    nombre_completo: string,
    correo: string,
    contrasena: string,
    rol: string,
    fecha_creacion: string,
    activo: boolean
  ) {
    super(id);
    this.nombre_completo = nombre_completo;
    this.correo = correo;
    this.contrasena = contrasena;
    this.rol = rol;
    this.fecha_creacion = fecha_creacion;
    this.activo = activo;
  }
}
