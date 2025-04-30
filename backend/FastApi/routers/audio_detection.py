from fastapi import APIRouter, UploadFile, File
from pydub import AudioSegment
import sys
import os
import uuid
import json
import psycopg2
from resemblyzer import VoiceEncoder, preprocess_wav

# Agrega el Model_IA al sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

# Importaciones necesarias
from Model_IA.transcribe.transcribe_handler import transcribe_audio
from Model_IA.keyword_detection.detect_keywords import detect_keywords
from Model_IA.config.aws_config import KEYWORDS
from Model_IA.speaker_recognition.recognizer import (
    identify_patient,
    load_patient_embeddings,
)

from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)

router = APIRouter()

# Cargar embeddings de pacientes
patient_embeddings = load_patient_embeddings()


# Función para convertir WebM a WAV
def convert_webm_to_wav(input_path, output_path):
    audio = AudioSegment.from_file(input_path, format="webm")
    audio.export(output_path, format="wav")


@router.post("/audio/detectar-palabras")
async def detectar_palabras(audio_file: UploadFile = File(...)):
    try:
        # Guardar archivo temporal (WebM)
        temp_filename_webm = f"temp_audio_{uuid.uuid4().hex}.webm"
        temp_path_webm = os.path.join("temp", temp_filename_webm)

        with open(temp_path_webm, "wb") as buffer:
            buffer.write(await audio_file.read())

        # Convertir a WAV
        temp_filename_wav = temp_filename_webm.replace(".webm", ".wav")
        temp_path_wav = os.path.join("temp", temp_filename_wav)
        convert_webm_to_wav(temp_path_webm, temp_path_wav)

        # Transcribir audio
        transcript = transcribe_audio(temp_path_wav)
        if not transcript:
            return {"error": "No se pudo transcribir el audio."}

        # Detectar palabras clave
        keywords_found = detect_keywords(transcript, KEYWORDS)

        # Identificar paciente
        patient_info = identify_patient(temp_path_wav, patient_embeddings)

        # Si se identificó un paciente, generar y guardar su nuevo embedding
        if patient_info:
            try:
                encoder = VoiceEncoder()
                wav = preprocess_wav(temp_path_wav)
                new_embedding = encoder.embed_utterance(wav)
                new_embedding_str = json.dumps(new_embedding.tolist())

                conn = psycopg2.connect(
                    dbname=os.getenv("DB_NAME"),
                    user=os.getenv("DB_USER"),
                    password=os.getenv("DB_PASSWORD"),
                    host=os.getenv("DB_HOST"),
                    port=os.getenv("DB_PORT"),
                )
                cur = conn.cursor()
                cur.execute(
                    """
                    UPDATE pacientes
                    SET embedding = %s
                    WHERE id = %s
                """,
                    (new_embedding_str, patient_info["id"]),
                )
                conn.commit()
                cur.close()
                conn.close()
                print(f"🧠 Embedding actualizado para {patient_info['nombre']}")
            except Exception as e:
                print(f"❌ Error al guardar embedding: {e}")

        # Eliminar archivos temporales
        os.remove(temp_path_webm)
        os.remove(temp_path_wav)

        return {
            "transcripcion": transcript,
            "palabras_clave": keywords_found,
            "paciente": patient_info,
        }

    except Exception as e:
        return {"error": f"Ocurrió un error: {str(e)}"}
