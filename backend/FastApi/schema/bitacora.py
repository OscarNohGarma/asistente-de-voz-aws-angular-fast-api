from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BitacoraSchema(BaseModel):
    id: Optional[int] = None
    id_alerta: int
    accion: str  # "creada", "confirmada", "escalada", "atendida", etc.
    usuario: str  # Nombre o identificador del que realiza la acción
    descripcion: Optional[str] = None
    fecha_accion: Optional[datetime] = None
