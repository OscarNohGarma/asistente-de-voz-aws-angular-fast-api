#NO DEJAR EJECUTANDO MUCHO TIEMPO EL SCRIPT, PARA NO REBASAR EL LIMITE GRATUITO DE AWS 
#LUEGO A MI ME LLEGARÁ LA FACTURA :(
#Este script genera un loop indefinido, para que pueda escuchar en tiempo real las palabras clave, por lo que cuando terminen sus pruebas
#paren el script, con ctrl + c o cerrando la terminal.
import os
import time
import uuid
import sounddevice as sd
from scipy.io.wavfile import write

from config.aws_config import KEYWORDS
from transcribe.transcribe_handler import transcribe_audio
from keyword_detection.detect_keywords import detect_keywords
from speaker_recognition.recognizer import identify_patient, load_patient_embeddings


def grabar_audio(duracion, sample_rate=44100):
    print("🎤 Grabando...")
    audio = sd.rec(int(duracion * sample_rate), samplerate=sample_rate, channels=1, dtype='int16')
    sd.wait()
    filename = f"temp_audio_{uuid.uuid4().hex[:6]}.wav"
    file_path = os.path.join("audio_input", filename)
    write(file_path, sample_rate, audio)
    print(f"📁 Guardado: {file_path}")
    return file_path

patient_embeddings = load_patient_embeddings()

def main_loop():
    print("🟢 Escuchando en tiempo real. Di algo...")
    while True:
        audio_path = grabar_audio(duracion=10)  
        try:
            transcript = transcribe_audio(audio_path)
            keywords_found = detect_keywords(transcript, KEYWORDS)

            if keywords_found:
                print("🔴 Palabras clave detectadas:", keywords_found)

                patient_info = identify_patient(audio_path, patient_embeddings)

                if patient_info:
                    print(f"👤 Paciente identificado:\n   ID: {patient_info['id']}\n   Nombre: {patient_info['nombre']}")
                else:
                    print("⚠️ No se pudo identificar al paciente. Solicitar ayuda manualmente.")
                    
            else:
                print("✅ No se detectaron palabras clave de emergencia.")
                
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            if os.path.exists(audio_path):
                os.remove(audio_path)

if __name__ == "__main__":
    main_loop()
