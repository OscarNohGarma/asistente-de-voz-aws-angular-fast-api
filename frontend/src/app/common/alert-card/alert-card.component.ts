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
  @Input() nombre_completo: string = '';
  @Input() foto_url: string = '';
  @Input() edad: number = 0;
  @Input() hora: string = '';
  @Input() nueva: boolean = true;
}
