import os
import json
import psycopg2
from resemblyzer import VoiceEncoder, preprocess_wav


from dotenv import load_dotenv

dotenv_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../backend/FastApi/.env")
)
load_dotenv(dotenv_path)

# Inicializa el encoder
encoder = VoiceEncoder()
# Conecta a tu base de datos PostgreSQL
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
)
cur = conn.cursor()

# Carpeta con los archivos de voz
audio_folder = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "audio_reference")
)

# Procesar cada archivo de voz
for filename in os.listdir(audio_folder):
    if filename.endswith(".wav") or filename.endswith(".mp3"):
        audio_path = os.path.join(audio_folder, filename)
        wav = preprocess_wav(audio_path)
        embedding = encoder.embed_utterance(wav)
        embedding_str = json.dumps(embedding.tolist())

        # Obtener el nombre sin extensión
        nombre_archivo = os.path.splitext(filename)[0]

        # Buscar el ID del paciente por nombre
        cur.execute(
            "SELECT id FROM pacientes WHERE LOWER(nombre_completo) = LOWER(%s)",
            (nombre_archivo,),
        )
        result = cur.fetchone()
        if result:
            id_paciente = result[0]
            cur.execute(
                """
                UPDATE pacientes
                SET embedding = %s
                WHERE id = %s
            """,
                (embedding_str, id_paciente),
            )
            print("OK- Embedding actualizado para {}".format(nombre_archivo))
        else:
            print(f"err- Paciente '{nombre_archivo}' no encontrado en la BD.")

# Guardar cambios y cerrar conexión
conn.commit()
cur.close()
conn.close()
