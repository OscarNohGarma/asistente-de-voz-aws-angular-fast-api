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
  private stream!: MediaStream;

  constructor(private http: HttpClient) {}

  async startRecording(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.audioChunks = [];
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
    console.log('🎤 Grabación iniciada...');
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.mediaRecorder.mimeType,
        });
        resolve(audioBlob);
      };
      this.mediaRecorder.stop();
      console.log('📁 Grabación detenida.');
    });
  }

  sendAudioToBackend(audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'audio.wav');
    console.log('Enviando...', formData);

    return this.http.post(
      'http://127.0.0.1:8000/audio/detectar-palabras',
      formData
    );
  }

  recordInIntervals(intervalMs: number, callback: (blob: Blob) => void): void {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      let chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mediaRecorder.mimeType });
        callback(audioBlob);
        chunks = [];
        mediaRecorder.start(); // reinicia grabación continua
        setTimeout(() => mediaRecorder.stop(), intervalMs);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), intervalMs);

      // Guarda referencia para poder detener desde fuera
      this.mediaRecorder = mediaRecorder;
      this.stream = stream;
    });
  }

  stopStream(): void {
    if (this.mediaRecorder?.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.stream?.getTracks().forEach((track) => track.stop());
  }
}
