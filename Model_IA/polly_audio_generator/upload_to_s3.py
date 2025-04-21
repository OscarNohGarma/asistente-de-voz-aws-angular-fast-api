import boto3
from botocore.exceptions import NoCredentialsError, ClientError

# Configura tus datos
bucket_name = 'mi-bucket-audio-asistente'  # Reemplázalo con el nombre de tu bucket
file_name = 'audio_input/test_emergencia.mp3'
object_name = 'test_emergencia.mp3'  # Nombre con el que se guardará en el bucket

def upload_to_aws(local_file, bucket, s3_file):
    s3 = boto3.client('s3')

    try:
        s3.upload_file(local_file, bucket, s3_file)
        print(f"✅ Archivo '{local_file}' subido exitosamente a S3 como '{s3_file}' en el bucket '{bucket}'")
        return True
    except FileNotFoundError:
        print("❌ El archivo no se encontró.")
        return False
    except NoCredentialsError:
        print("❌ No se encontraron credenciales de AWS.")
        return False
    except ClientError as e:
        print(f"❌ Error al subir el archivo: {e}")
        return False

# Llamada a la función
upload_to_aws(file_name, bucket_name, object_name)
