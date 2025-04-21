# transcribe/transcribe_client.py
# Transcribe el audio que se sube a S3 y devuelve el texto transcrito
import boto3
import uuid
import os

from config.aws_config import AWS_REGION, S3_BUCKET_NAME

s3 = boto3.client('s3', region_name=AWS_REGION)
transcribe = boto3.client('transcribe', region_name=AWS_REGION)

def upload_audio_to_s3(audio_path):
    audio_filename = os.path.basename(audio_path)
    s3_key = f"audios/{uuid.uuid4()}_{audio_filename}"
    s3.upload_file(audio_path, S3_BUCKET_NAME, s3_key)
    return f"s3://{S3_BUCKET_NAME}/{s3_key}"
