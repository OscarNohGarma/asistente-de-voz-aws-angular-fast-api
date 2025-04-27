import { Component } from '@angular/core';
import { AudioRecorderService } from '../../core/services/audio-recorder.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,

  imports: [CommonModule],
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent {
  isRecording = false; // Estado de grabación
  lastRecording: any; // Para almacenar la última grabación (opcional)

  constructor(private audioRecorderService: AudioRecorderService) {}

  // Método para iniciar la grabación
  startRecording() {
    this.isRecording = true;
    this.audioRecorderService.startRecording();
  }

  // Método para detener la grabación y enviar el audio
  async stopRecording() {
    this.isRecording = false;
    const audioBlob = await this.audioRecorderService.stopRecording();
    console.log('Enviando audio al backend...');
    this.audioRecorderService.sendAudioToBackend(audioBlob).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        this.lastRecording = response; // Guardar respuesta del backend
      },
      (error) => {
        console.error('Error al enviar el audio al backend:', error);
      }
    );
  }
}
