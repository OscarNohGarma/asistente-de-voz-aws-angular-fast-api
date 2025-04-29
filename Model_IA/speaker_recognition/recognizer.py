from resemblyzer import VoiceEncoder, preprocess_wav
import numpy as np
import os
import glob
import psycopg2
import json

from scipy.spatial.distance import cosine

# Inicializar el encoder
encoder = VoiceEncoder()

# Cargar las voces de referencia
def load_patient_embeddings():
    embeddings = {}
    try:
        conn = psycopg2.connect(
            dbname="fast_api",
            user="postgres",
            password="n20pyali",
            host="localhost",  # o el hostname de tu contenedor
            port="5432"
        )
        cur = conn.cursor()
        cur.execute("SELECT id, nombre_completo, embedding FROM pacientes WHERE embedding IS NOT NULL AND activo = TRUE")

        for paciente_id, nombre, embedding_str in cur.fetchall():
            embedding = np.array(json.loads(embedding_str))
            embeddings[paciente_id] = {
                "nombre": nombre,
                "embedding": embedding
            }

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error al cargar embeddings desde la BD: {e}")
    return embeddings

# Comparar voz capturada contra voces registradas
def identify_patient(audio_path, patient_embeddings, threshold=0.6):
    try:
        wav = preprocess_wav(audio_path)
        embed = encoder.embed_utterance(wav)

        best_match_id = None
        best_score = 1.0

        for paciente_id, info in patient_embeddings.items():
            ref_embed = info["embedding"]
            nombre = info["nombre"]
            score = cosine(embed, ref_embed)
            print(f"🔍 Comparando contra {nombre} -> score: {score:.2f}")

            if score < best_score:
                best_score = score
                best_match_id = paciente_id

        if best_score < threshold:
            matched_info = patient_embeddings[best_match_id]
            return {
                "id": best_match_id,
                "nombre": matched_info["nombre"]
            }
        else:
            return None
    except Exception as e:
        print(f"Error al identificar al paciente: {e}")
        return None
