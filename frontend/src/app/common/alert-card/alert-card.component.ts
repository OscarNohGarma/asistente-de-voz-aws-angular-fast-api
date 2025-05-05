import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-card.component.html',
  styleUrls: ['./alert-card.component.scss'],
})
export class AlertCardComponent {
  @Input() nombre_completo: string = '';
  @Input() foto_url: string = '';
  @Input() edad: number = 0;
  @Input() hora: string = '';
  @Input() nueva: boolean = true;
  @Output() cardClick = new EventEmitter<void>();

  handleClick(): void {
    this.cardClick.emit();
  }
  validarHora(hora: string): string {
    const [horasStr, _] = hora.split(':');
    const horas = parseInt(horasStr, 10);

    if (isNaN(horas) || horas < 0 || horas > 23) {
      return 'Hora inválida';
    }

    return horas < 12 ? 'a.m.' : 'p.m.';
  }
}
