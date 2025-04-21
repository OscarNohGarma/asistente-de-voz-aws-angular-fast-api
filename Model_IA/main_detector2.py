#Main Detector Lectura Varios Archivos De audio_input

import os
from config.aws_config import KEYWORDS
from transcribe.transcribe_handler import transcribe_audio  
from keyword_detection.detect_keywords import detect_keywords

def main(audio_path):
    print(f"\n🔍 Analizando archivo: {audio_path}")
    try:
        transcript = transcribe_audio(audio_path)
        keywords_found = detect_keywords(transcript, KEYWORDS)

        if keywords_found:
            print("🔴 Palabras clave detectadas:", keywords_found)
        else:
            print("✅ No se detectaron palabras clave de emergencia.")
    except Exception as e:
        print(f"❌ Error al procesar {audio_path}: {e}")

if __name__ == "__main__":
    input_folder = "audio_input"

    # Recorre todos los archivos dentro de audio_input/
    for file_name in os.listdir(input_folder):
        if file_name.endswith((".mp3", ".wav")):  # Formatos
            audio_path = os.path.join(input_folder, file_name)
            main(audio_path)
