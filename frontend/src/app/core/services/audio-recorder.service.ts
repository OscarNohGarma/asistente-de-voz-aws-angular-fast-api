// frontend/src/app/services/audio-recorder.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioRecorderService {
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];

  constructor(private http: HttpClient) {}

  // Inicia la grabación de audio
  async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.audioChunks = [];
    this.mediaRecorder.start();
    console.log('🎤 Grabación iniciada...');
  }

  // Detiene la grabación de audio y devuelve un Blob
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };
      this.mediaRecorder.stop();
      console.log('📁 Grabación detenida.');
    });
  }

  // Envía el audio grabado al backend para su procesamiento
  sendAudioToBackend(audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'audio.wav');

    // Imprimir para verificar que los datos se agregan correctamente
    console.log('Enviando FormData:', formData);

    return this.http.post(
      'http://127.0.0.1:8000/audio/detectar-palabras',
      formData
    );
  }
}
