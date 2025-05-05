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

@Component({
  selector: 'app-home-enfermeria',
  standalone: true,
  imports: [
    CommonModule,
    AlertCardComponent,
    HeaderComponent,
    ReactiveFormsModule,
  ],
  providers: [AlertaService],
  templateUrl: './home-enfermeria.component.html',
  styleUrls: ['./home-enfermeria.component.scss'],
})
export class HomeEnfermeriaComponent implements OnInit, OnDestroy {
  nombreUsuario: string = '';
  alertaItems: Alerta[] = [];
  mensajes: string[] = [];
  private sub!: Subscription;
  userInteracted = false;
  overlayOpen = false;
  alertaSeleccionada?: Alerta;
  sendForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertaService: AlertaService,
    private alertSocketService: AlertSocketService,
    private ngZone: NgZone, // Inyectamos NgZone
    private fb: FormBuilder
  ) {
    this.sendForm = this.fb.group({
      tipo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    window.addEventListener('click', () => {
      this.userInteracted = true;
    });
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';

    this.cargarAlertas(); // <-- Llamamos esta función al iniciar

    console.log('Iniciando suscripción de alertas...');
    this.sub = this.alertSocketService.getMessages().subscribe((msg) => {
      console.log('Alerta recibida:', msg);
      this.mensajes.push(msg);
      // Reproducir sonido de alerta
      this.reproducirSonido();
      // Recargar las alertas
      this.ngZone.run(() => {
        this.cargarAlertas();
      });

      setTimeout(() => {
        this.mensajes.shift();
      }, 5000);
    });
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  cargarAlertas(): void {
    this.alertaService.getAll().subscribe({
      next: (data) => {
        this.alertaItems = data
          .filter((alerta) => alerta.estado === 'pendiente')
          .sort((a, b) => {
            const horaA = a.hora.split(':').map(Number);
            const horaB = b.hora.split(':').map(Number);
            return horaA[0] !== horaB[0]
              ? horaA[0] - horaB[0]
              : horaA[1] - horaB[1];
          })
          .reverse();
        console.log('Alertas actualizadas:', this.alertaItems);
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
    console.log(alerta.id);
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

  confirmarAlerta(): void {
    // this.alertaService.confirmar(this.alertaSeleccionada.id).subscribe(() => {
    //   this.cargarAlertas();
    //   this.cerrarOverlay();
    // });
  }

  escalarAlerta(): void {
    if (!this.alertaSeleccionada) return;
    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched();
      return;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched();
      return;
    }
    if (!this.alertaSeleccionada) return;

    const { tipo } = this.sendForm.value;

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
}
function getLocalISOStringWithMicroseconds(): string {
  const now = new Date();
  const pad = (n: number, width = 2) => n.toString().padStart(width, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());
  const millis = now.getMilliseconds().toString().padStart(3, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millis}000`;
}
