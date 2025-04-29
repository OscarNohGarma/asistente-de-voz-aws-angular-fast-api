import os
import json
import psycopg2
from resemblyzer import VoiceEncoder, preprocess_wav

# Inicializa el encoder
encoder = VoiceEncoder()

# Conecta a tu base de datos PostgreSQL
conn = psycopg2.connect(
            dbname="fast_api",
            user="postgres",
            password="n20pyali",
            host="localhost",  # o el hostname de tu contenedor
            port="5432"
)
cur = conn.cursor()

# Carpeta con los archivos de voz
audio_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "audio_reference"))

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
        cur.execute("SELECT id FROM pacientes WHERE LOWER(nombre_completo) = LOWER(%s)", (nombre_archivo,))
        result = cur.fetchone()
        if result:
            id_paciente = result[0]
            cur.execute("""
                UPDATE pacientes
                SET embedding = %s
                WHERE id = %s
            """, (embedding_str, id_paciente))
            print(f"✅ Embedding actualizado para {nombre_archivo}")
        else:
            print(f"⚠️ Paciente '{nombre_archivo}' no encontrado en la BD.")

# Guardar cambios y cerrar conexión
conn.commit()
cur.close()
conn.close()
