import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AlertSocketService } from '../core/services/alert-socket.service';
import { AlertaService } from '../core/services/alerta.service';
import { Alerta } from '../core/models/alertas';
import { AudioRecorderComponent } from '../common/audio-recorder/audio-recorder.component';
import { getLocalISOStringWithMicroseconds } from '../core/functions/functions';
import { BitacoraService } from '../core/services/bitacora.service';
import { Bitacora } from '../core/models/bitacora';
import { HeaderComponent } from '../common/header/header.component';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../core/services/sweet-alert.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  nombreUsuario: string = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertSocketService: AlertSocketService,
    private alertaService: AlertaService,
    private bitacoraService: BitacoraService,
    private swal: SweetAlertService
  ) {}
  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';
  }
  handleLogout() {
    this.swal
      .confirm('¿Deseas cerrar sesión?', '¿Cerrar la sesión actual  ?')
      .then((result) => {
        if (result) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
  }
  enviar() {
    // Aquí creamos una nueva alerta
    const nuevaAlerta = new Alerta(
      0, // ID de la alerta

      (Math.floor(Math.random() * 3) + 1).toString(), // id_pacientes como string
      'pendiente', // Estado
      '', // Tipo
      getLocalISOStringWithMicroseconds(), // Fecha de confirmación actual
      undefined,
      true,
      ['emergencia', '911']
    );

    // Ahora enviamos la alerta al backend
    this.alertaService.add(nuevaAlerta).subscribe({
      next: (response) => {
        console.log('Alerta enviada con éxito', response);
        this.alertSocketService.sendMessage('ayuda');

        const nuevaBitacora = new Bitacora(
          0,
          response.alerta.id,
          'solicitud',
          '',
          '',
          getLocalISOStringWithMicroseconds()
        );
        this.bitacoraService.add(nuevaBitacora).subscribe({
          next: (response) => {
            console.log('Bitácora enviada con éxito', response);
          },
          error: (err) => {
            console.error('Error al enviar la bitácora', err);
          },
        });
      },
      error: (err) => {
        console.error('Error al enviar la alerta', err);
      },
    });
  }
}
