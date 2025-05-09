from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AlertaSchema(BaseModel):
    id: Optional[int] = None
    id_paciente: str
    tipo: str
    estado: str
    # confirmada_por: Optional[str] = None
    fecha: Optional[datetime] = None
    nueva: Optional[bool] = True
    palabras_clave: Optional[List[str]] = None
