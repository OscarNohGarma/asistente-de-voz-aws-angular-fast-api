import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment/environment';

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
  getPacienteFotoUrl(fotoUrl: string): string {
    return `${environment.apiUrl}${fotoUrl}`;
  }
}
