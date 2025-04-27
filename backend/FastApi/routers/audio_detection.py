# backend/FastApi/routers/audio_detection.py
from fastapi import APIRouter, UploadFile, File
import sys
import os
import uuid

# Agrega el Model_IA al sys.path

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))


# Ahora sí puedes importar
from Model_IA.transcribe.transcribe_handler import transcribe_audio
from Model_IA.keyword_detection.detect_keywords import detect_keywords
from Model_IA.config.aws_config import KEYWORDS

router = APIRouter()


@router.post("/audio/detectar-palabras")
async def detectar_palabras(audio_file: UploadFile = File(...)):
    try:
        # Guardar audio temporal
        temp_filename = f"temp_audio_{uuid.uuid4().hex}.wav"
        temp_path = os.path.join("temp", temp_filename)

        with open(temp_path, "wb") as buffer:
            buffer.write(await audio_file.read())

        # Procesar con el flujo existente
        transcript = transcribe_audio(temp_path)
        keywords_found = detect_keywords(transcript, KEYWORDS)

        os.remove(temp_path)

        return {"palabras_clave": keywords_found}
    except Exception as e:
        return {"error": str(e)}
