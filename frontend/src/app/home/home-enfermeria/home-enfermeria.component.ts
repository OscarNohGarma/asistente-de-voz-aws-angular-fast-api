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

@Component({
  selector: 'app-home-enfermeria',
  standalone: true,
  imports: [CommonModule, AlertCardComponent, HeaderComponent],
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertaService: AlertaService,
    private alertSocketService: AlertSocketService,
    private ngZone: NgZone // Inyectamos NgZone
  ) {}

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
}
