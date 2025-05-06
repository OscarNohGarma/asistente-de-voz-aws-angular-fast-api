import { Component } from '@angular/core';
import { AudioRecorderService } from '../../core/services/audio-recorder.service';
import { CommonModule } from '@angular/common';
import { Alerta } from '../../core/models/alertas';
import { AlertaService } from '../../core/services/alerta.service';
import { AlertSocketService } from '../../core/services/alert-socket.service';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent {
  isRecording = false;
  lastRecording: any;

  constructor(
    private audioRecorderService: AudioRecorderService,
    private alertaService: AlertaService,
    private alertSocketService: AlertSocketService
  ) {}

  startRecording() {
    this.isRecording = true;
    this.audioRecorderService.recordInIntervals(5000, (audioBlob) => {
      this.audioRecorderService.sendAudioToBackend(audioBlob).subscribe(
        (response) => {
          if (response?.palabras_clave?.length > 0) {
            console.log(response);

            this.enviar(response.paciente.id, response.palabras_clave);
          }
        },
        (error) => {
          console.error('❌ Error al enviar el audio:', error);
        }
      );
    });
  }

  stopRecording() {
    this.isRecording = false;
    this.audioRecorderService.stopStream();
    console.log('🛑 Grabación continua detenida.');
  }

  enviar(id_paciente: number, palabras_clave: string[]) {
    const obtenerHoraActual = () => {
      const ahora = new Date();
      return `${ahora.getHours().toString().padStart(2, '0')}:${ahora
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    };

    const nuevaAlerta = new Alerta(
      0,
      id_paciente.toString(),
      obtenerHoraActual(),
      'pendiente',
      '',
      '',
      new Date().toISOString(),
      undefined,
      true,
      palabras_clave
    );

    this.alertaService.add(nuevaAlerta).subscribe({
      next: (response) => {
        console.log('✅ Alerta enviada', response);
        this.alertSocketService.sendMessage('¡Un paciente necesita ayuda!');
      },
      error: (err) => {
        console.error('⚠️ Error al enviar la alerta', err);
      },
    });
  }
}
