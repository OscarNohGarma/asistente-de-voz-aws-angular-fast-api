from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List
from utils.email_utils import enviar_correo

router = APIRouter()


class Paciente(BaseModel):
    nombre_completo: str
    foto_url: str
    habitacion: str
    edad: int
    diagnostico: str


class AlertaEscalada(BaseModel):
    id: int
    id_paciente: str
    tipo: str
    estado: str
    descripcion: str
    fecha: str
    nueva: bool
    palabras_clave: List[str]
    paciente: Paciente
    correo_medico: EmailStr


@router.post("/escalar-alerta")
async def escalar_alerta(alerta: AlertaEscalada):
    asunto = f"🚨 Alerta escalada: Atención urgente requerida para {alerta.paciente.nombre_completo}"
    cuerpo = (
        f"⚠️ **¡Alerta escalada!** Se requiere atención médica urgente para el siguiente paciente:\n\n"
        f"👨‍⚕️ **Paciente:** {alerta.paciente.nombre_completo}\n"
        f"🏥 **Ubicación:** Habitación {alerta.paciente.habitacion}\n"
        f"🎂 **Edad:** {alerta.paciente.edad} años\n"
        f"🩺 **Diagnóstico:** {alerta.paciente.diagnostico}\n\n"
        f"🔔 **Detalles de la alerta:**\n"
        f"  - **Descripción:** {alerta.descripcion}\n"
        f"  - **Fecha y hora:** {alerta.fecha}\n"
        f"  - **Tipo de alerta:** {alerta.tipo.capitalize()}\n"
        f"  - **Palabras clave asociadas:** {', '.join(alerta.palabras_clave)}\n\n"
        f"📝 **Acción recomendada:**\n"
        f"Por favor, atienda esta alerta con **prioridad** para garantizar la seguridad del paciente. Su intervención es crucial para determinar los siguientes pasos.\n\n"
        f"Gracias por su atención a este asunto urgente.\n\n"
        f"Este correo fue generado automáticamente. Si tiene alguna duda, por favor, comuníquese con el personal correspondiente."
    )

    enviado = enviar_correo(alerta.correo_medico, asunto, cuerpo)

    if not enviado:
        raise HTTPException(
            status_code=500, detail="No se pudo enviar el correo. Intente nuevamente."
        )

    return {"mensaje": "Alerta escalada y correo enviado al médico con éxito."}
