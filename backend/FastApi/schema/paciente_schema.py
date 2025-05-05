from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PacienteSchema(BaseModel):
    id: Optional[int] = None  # Opcional al crear nuevos registros
    nombre_completo: str
    foto_url: Optional[str] = None  # Campo para la URL de la foto
    edad: int
    habitacion: str
    diagnostico: str
    fecha_ingreso: Optional[datetime] = (
        None  # Opcional porque puede tomar el valor por defecto en la DB
    )
    activo: bool
    telefono_familiar: Optional[str] = None
    correo_familiar: Optional[str] = None
