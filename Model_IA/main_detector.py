from config.aws_config import KEYWORDS
from transcribe.transcribe_handler import transcribe_audio  
from keyword_detection.detect_keywords import detect_keywords


def main(audio_path):
    # Transcribe the audio file
    transcript = transcribe_audio(audio_path)
    keywords_found = detect_keywords(transcript, KEYWORDS)

    if keywords_found:
        print("🔴 Palabras clave detectadas:", keywords_found)
    else:
        print("✅ No se detectaron palabras clave de emergencia.")

if __name__ == "__main__":
    main("audio_input/test_emergencia.mp3")