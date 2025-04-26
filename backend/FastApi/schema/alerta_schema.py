from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertaSchema(BaseModel):
    id: Optional[int] = None
    id_pacientes: str
    tipo: str
    hora: str
    estado: str
    confirmada_por: Optional[str] = None
    fecha_confirmacion: Optional[datetime] = None
