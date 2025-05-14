import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertCardComponent } from '../../common/alert-card/alert-card.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../common/header/header.component';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../core/models/alertas';
import { AlertSocketService } from '../../core/services/alert-socket.service';
import { Subscription } from 'rxjs';
import { error } from 'node:console';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BitacoraService } from '../../core/services/bitacora.service';
import { Bitacora } from '../../core/models/bitacora';
import {
  formatearFechaAlerta,
  getLocalISOStringWithMicroseconds,
} from '../../core/functions/functions';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario';

@Component({
  selector: 'app-home-enfermeria',
  standalone: true,
  imports: [CommonModule, AlertCardComponent, ReactiveFormsModule],
  providers: [AlertaService],
  templateUrl: './home-enfermeria.component.html',
  styleUrls: ['./home-enfermeria.component.scss'],
})
export class HomeEnfermeriaComponent implements OnInit, OnDestroy {
  nombreUsuario: string = '';
  alertaItems: Alerta[] = [];
  usuarioItems: Usuario[] = [];
  mensajes: string[] = [];
  private sub!: Subscription;
  userInteracted = false;
  overlayOpen = false;
  alertaSeleccionada?: Alerta;
  sendForm: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService,
    private alertaService: AlertaService,
    private alertSocketService: AlertSocketService,
    private usuarioService: UsuarioService,
    private bitacoraService: BitacoraService,
    private ngZone: NgZone, // Inyectamos NgZone
    private fb: FormBuilder
  ) {
    this.sendForm = this.fb.group({
      tipo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    window.addEventListener('click', () => {
      this.userInteracted = true;
    });
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';

    this.cargarAlertas(); // <-- Llamamos esta función al iniciar
    this.cargarUsuarios();
    this.recibirAlertas();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  recibirAlertas() {
    this.sub = this.alertSocketService.getMessages().subscribe((msg) => {
      console.log('Alerta recibida:', msg);
      if (msg === 'ayuda') {
        this.mensajes.push('¡Un paciente necesita ayuda!');
        // Reproducir sonido de alerta
        this.reproducirSonido();
        // Recargar las alertas
        this.ngZone.run(() => {
          this.cargarAlertas();
        });

        setTimeout(() => {
          this.mensajes.shift();
        }, 5000);
      }
    });
  }
  cargarAlertas(): void {
    this.alertaService.getAll().subscribe({
      next: (data) => {
        this.alertaItems = data
          .filter((alerta) => alerta.estado === 'pendiente')
          .sort((a, b) => {
            const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
            const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
            return fechaB - fechaA;
          });

        console.log('Alertas actualizadas:', this.alertaItems);
      },
      error: (err) => {
        console.error('Error al obtener las alertas', err);
      },
    });
  }
  cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarioItems = data.filter((usuario) => usuario.rol === 'medico');

        console.log('Alertas actualizadas:', this.usuarioItems);
      },
      error: (err) => {
        console.error('Error al obtener las alertas', err);
      },
    });
  }
  reproducirSonido(): void {
    if (!this.userInteracted) return; // Evita reproducir si no ha habido interacción
    const audio = new Audio();
    audio.src = '../../../assets/sounds/alerta.mp3'; // Asegúrate de tener este archivo
    audio.load();
    audio.play();
  }

  handleOpenOverlay(alerta: Alerta): void {
    this.alertaSeleccionada = alerta;
    this.overlayOpen = true;
    if (!this.alertaSeleccionada.nueva) return;
    const alertaActualizada = { ...alerta, nueva: false };
    this.alertaService
      .update(alerta.id.toString(), alertaActualizada)
      .subscribe({
        next: (data) => {
          console.log('Alertas actualizada');
          this.cargarAlertas();
        },
        error: (error) => {
          console.log('Error al actualizar');
        },
      });
  }

  cerrarOverlay(): void {
    this.overlayOpen = false;
    this.alertaSeleccionada = undefined;
  }

  onSubmit() {
    this.submitted = true;

    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched();
      return;
    }
    if (!this.alertaSeleccionada) return;

    const { tipo, descripcion } = this.sendForm.value;

    // Obtener timestamp con 6 dígitos en los milisegundos (microsegundos simulados)
    let fechaConfirmacion = new Date().toISOString(); // Ej: "2025-04-30T23:15:56.611Z"
    fechaConfirmacion = fechaConfirmacion.replace('Z', '000'); // convierte a: "2025-04-30T23:15:56.611000"

    const alertaActualizada = {
      ...this.alertaSeleccionada,
      tipo,
      estado: this.requiereEscalamiento() ? 'escalada' : 'confirmada',
      confirmada_por: this.authService.getNombre()?.toString(),
      fecha_confirmacion: getLocalISOStringWithMicroseconds(),
    };
    this.alertaService
      .update(alertaActualizada.id.toString(), alertaActualizada)
      .subscribe({
        next: (data) => {
          console.log('Alertas actualizada');
          this.cargarAlertas();
          this.cerrarOverlay();

          const nuevaBitacora = new Bitacora(
            0,
            alertaActualizada.id,
            this.requiereEscalamiento() ? 'escalado' : 'atendido-enfermero',
            this.nombreUsuario,
            descripcion,
            getLocalISOStringWithMicroseconds()
          );
          this.bitacoraService.add(nuevaBitacora).subscribe({
            next: (response) => {
              console.log('Bitácora enviada con éxito', response);
              if (this.requiereEscalamiento()) {
                this.alertSocketService.sendMessage('escalamiento');

                this.usuarioItems.forEach((usuario) => {
                  const alertaEscalada = {
                    ...alertaActualizada,
                    correo_medico: usuario.correo, // Puedes obtenerlo dinámicamente si lo manejas en tu backend
                    descripcion,
                  };

                  this.alertaService.escalarAlerta(alertaEscalada).subscribe({
                    next: (resp) => {
                      console.log('Correo enviado al médico:', resp);
                    },
                    error: (err) => {
                      console.error('Error al enviar correo al médico:', err);
                    },
                  });
                });
              }
            },
            error: (err) => {
              console.error('Error al enviar la bitácora', err);
            },
          });
        },
        error: (error) => {
          console.log('Error al actualizar');
        },
      });
  }
  get f() {
    return this.sendForm.controls;
  }

  requiereEscalamiento(): boolean {
    const tipo = this.sendForm.value.tipo;
    return tipo === 'naranja' || tipo === 'rojo';
  }

  validarHora(fechaIso: string): string {
    return formatearFechaAlerta(fechaIso);
  }
}
