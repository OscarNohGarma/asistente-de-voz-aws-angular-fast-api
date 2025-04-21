# transcribe/transcribe_handler.py
# Espera la transcripción de un archivo de audio en español y devuelve el texto transcrito
import time
import boto3
import uuid
from transcribe.transcribe_client import transcribe, upload_audio_to_s3

def transcribe_audio(audio_path):
    job_name = f"transcribe_job_{uuid.uuid4().hex[:8]}"
    s3_uri = upload_audio_to_s3(audio_path)

    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': s3_uri},
        MediaFormat=audio_path.split(".")[-1],
        LanguageCode='es-ES',  # español
    )

    print("⏳ Esperando transcripción...")
    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        time.sleep(5)

    if status['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED':
        transcript_url = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
        import requests
        result = requests.get(transcript_url).json()
        return result['results']['transcripts'][0]['transcript']
    else:
        raise Exception("❌ Error en la transcripción")
