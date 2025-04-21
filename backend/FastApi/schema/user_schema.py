from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSchema(BaseModel):
    id: Optional[int] = None  # Esto permite que el campo 'id' sea opcional y no sea necesario al crear nuevos usuarios.
    nombre_completo: str
    correo: str
    contrasena: str
    rol: str
    fecha_creacion: str
    activo: bool
