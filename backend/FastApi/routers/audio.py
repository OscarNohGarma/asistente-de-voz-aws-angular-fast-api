from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydub import AudioSegment
import os
import uuid
import psycopg
import subprocess
from dotenv import load_dotenv

dotenv_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"
)
load_dotenv(dotenv_path)

router = APIRouter()

current_dir = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
RUTA_AUDIO = os.path.join(BASE_DIR, "Model_IA", "audio_reference")
os.makedirs(RUTA_AUDIO, exist_ok=True)


def obtener_nombre_paciente(id_paciente: int) -> str:
    print(f"[LOG] Consultando nombre para paciente con ID: {id_paciente}")
    conn = None
    try:
        conn = psycopg.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
        )
        with conn.cursor() as cur:
            cur.execute(
                "SELECT nombre_completo FROM pacientes WHERE id = %s", (id_paciente,)
            )
            row = cur.fetchone()
            if row:
                print(f"[LOG] Nombre encontrado: {row[0]}")
                return row[0]
            else:
                print("[LOG] No se encontró paciente con ese ID")
                return None
    except Exception as e:
        print(f"[ERROR] Error en consulta BD: {e}")
        return None
    finally:
        if conn:
            conn.close()
            print("[LOG] Conexión BD cerrada")


@router.post("/audio/guardar")
async def guardar_audio(
    id_paciente: int = Form(...), audio_file: UploadFile = File(...)
):
    print(f"[LOG] Recibido audio para paciente ID: {id_paciente}")
    nombre_paciente = obtener_nombre_paciente(id_paciente)
    if not nombre_paciente:
        print("[ERROR] Paciente no encontrado, abortando")
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    try:
        nombre_archivo_wav = f"{nombre_paciente}.wav"
        ruta_wav = os.path.join(RUTA_AUDIO, nombre_archivo_wav)
        print(f"[LOG] Guardando archivo WAV en: {ruta_wav}")

        contenido = await audio_file.read()
        with open(ruta_wav, "wb") as f:
            f.write(contenido)
        print("[LOG] Archivo WAV guardado correctamente")

        # Ejecutar el script register_embeddings.py desde la raíz del proyecto
        print("[LOG] Ejecutando script register_embeddings.py")
        raiz_proyecto = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
        resultado = subprocess.run(
            ["python", "Model_IA/speaker_recognition/register_embeddings.py"],
            cwd=raiz_proyecto,
            capture_output=True,
            text=True,
            check=False,
        )
        print("[LOG] Salida stdout del script:\n", resultado.stdout)
        if resultado.returncode != 0:
            print("[ERROR] El script devolvió un error:\n", resultado.stderr)

        return {
            "mensaje": "Audio guardado exitosamente y script ejecutado",
            "archivo_guardado": f"Model_IA/audio_reference/{nombre_archivo_wav}",
            "id_paciente": id_paciente,
            "nombre_paciente": nombre_paciente,
        }
    except Exception as e:
        print(f"[ERROR] Excepción al guardar audio o ejecutar script: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo guardar el audio o ejecutar el script: {str(e)}",
        )


@router.post("/embedding/actualizar")
async def actualizar_embedding():
    try:
        print("[LOG] Ejecutando script register_embeddings.py")
        raiz_proyecto = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
        resultado = subprocess.run(
            ["python", "Model_IA/speaker_recognition/register_embeddings.py"],
            cwd=raiz_proyecto,
            capture_output=True,
            text=True,
            check=False,
        )
        print("[LOG] Salida stdout del script:\n", resultado.stdout)
        if resultado.returncode != 0:
            print("[ERROR] El script devolvió un error:\n", resultado.stderr)
            raise HTTPException(
                status_code=500,
                detail=f"Error al ejecutar el script: {resultado.stderr}",
            )
        return {"mensaje": "Embeddings actualizados correctamente"}
    except Exception as e:
        print(f"[ERROR] Excepción al ejecutar el script: {e}")
        raise HTTPException(
            status_code=500, detail=f"No se pudo ejecutar el script: {str(e)}"
        )
