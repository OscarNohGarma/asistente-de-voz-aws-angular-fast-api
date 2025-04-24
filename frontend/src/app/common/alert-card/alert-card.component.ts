import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-card.component.html',
  styleUrls: ['./alert-card.component.scss'],
})
export class AlertCardComponent {
  @Input() paciente: string = '';
  @Input() fotoUrl: string = '';
  @Input() alerta: string = '';
  @Input() hora: string = '';
}
