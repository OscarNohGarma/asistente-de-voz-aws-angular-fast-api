import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertSocketService } from '../../core/services/alert-socket.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.scss',
})
export class AlertListComponent implements OnInit, OnDestroy {
  mensajes: string[] = [];
  private sub!: Subscription;

  constructor(private alertSocketService: AlertSocketService) {}

  ngOnInit(): void {
    console.log('Iniciando suscripción de alertas...');
    this.sub = this.alertSocketService.getMessages().subscribe((msg) => {
      console.log('Alerta recibida:', msg);
      this.mensajes.push(msg);
      // Aquí puedes lanzar un modal, mostrar una tarjeta, reproducir sonido, etc.
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
