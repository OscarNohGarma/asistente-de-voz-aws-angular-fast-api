import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AlertSocketService } from '../core/services/alert-socket.service';
import { AlertaService } from '../core/services/alerta.service';
import { Alerta } from '../core/models/alertas';
import { AudioRecorderComponent } from '../common/audio-recorder/audio-recorder.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AudioRecorderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertSocketService: AlertSocketService,
    private alertaService: AlertaService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  enviar() {
    console.log('Enviando alerta desde admin...');
    this.alertSocketService.sendMessage('¡Paciente necesita ayuda!');

    const numeroAleatorio = Math.floor(Math.random() * 5) + 1;

    // Aquí creamos una nueva alerta
    const nuevaAlerta = new Alerta(
      0, // ID de la alerta
      numeroAleatorio.toString(), // id_pacientes como string
      '15:20', // Hora
      'pendiente', // Estado
      '', // Tipo
      '', // Confirmada por
      '2025-04-25T17:43:45.521387' // Fecha de confirmación (en formato ISO 8601)
    );

    // Ahora enviamos la alerta al backend
    this.alertaService.add(nuevaAlerta).subscribe({
      next: (response) => {
        console.log('Alerta enviada con éxito', response);
      },
      error: (err) => {
        console.error('Error al enviar la alerta', err);
      },
    });
  }
}
