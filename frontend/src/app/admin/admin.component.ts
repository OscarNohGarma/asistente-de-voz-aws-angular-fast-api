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
    const numeroAleatorio = Math.floor(Math.random() * 3) + 1;

    // Función para generar una hora aleatoria
    function generarHoraAleatoria(): string {
      const hora = Math.floor(Math.random() * 24); // de 0 a 23
      const minuto = Math.floor(Math.random() * 60); // de 0 a 59

      // Formatear con ceros a la izquierda si es necesario
      const horaFormateada = hora.toString().padStart(2, '0');
      const minutoFormateado = minuto.toString().padStart(2, '0');

      return `${horaFormateada}:${minutoFormateado}`;
    }

    // Aquí creamos una nueva alerta
    const nuevaAlerta = new Alerta(
      0, // ID de la alerta
      numeroAleatorio.toString(), // id_pacientes como string
      generarHoraAleatoria(), // Hora aleatoria
      'pendiente', // Estado
      '', // Tipo
      '', // Confirmada por
      new Date().toISOString(), // Fecha de confirmación actual
      undefined,
      true,
      ['emergencia', '911']
    );

    // Ahora enviamos la alerta al backend
    this.alertaService.add(nuevaAlerta).subscribe({
      next: (response) => {
        console.log('Alerta enviada con éxito', response);
        console.log('Enviando alerta desde admin...');
        this.alertSocketService.sendMessage('¡Un paciente necesita ayuda!');
      },
      error: (err) => {
        console.error('Error al enviar la alerta', err);
      },
    });
  }
}
