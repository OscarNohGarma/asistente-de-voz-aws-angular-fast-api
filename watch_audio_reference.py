from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import os
from subprocess import run

class AudioRefHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.src_path.endswith(".wav"):
            print(f"🎧 Nuevo archivo detectado: {event.src_path}")
            run(["python", "Model_IA/speaker_recognition/register_embeddings.py"])

if __name__ == "__main__":
    # Obtener ruta absoluta del script actual
    base_dir = os.path.dirname(os.path.abspath(__file__))
    audio_ref_path = os.path.join(base_dir, "Model_IA/audio_reference")

    if not os.path.exists(audio_ref_path):
        print(f"❌ Carpeta no encontrada: {audio_ref_path}")
        exit(1)

    event_handler = AudioRefHandler()
    observer = Observer()
    observer.schedule(event_handler, path=audio_ref_path, recursive=False)
    observer.start()
    print(f"📂 Observando nuevos audios en: {audio_ref_path}")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
