import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-solicitudes-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-solicitudes-historial.component.html',
  styleUrl: './app-solicitudes-historial.component.scss'
})
export class AppSolicitudesHistorialComponent {
  @Input() paciente: any;
}
