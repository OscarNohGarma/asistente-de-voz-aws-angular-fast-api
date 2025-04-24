import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AlertSocketService } from '../core/services/alert-socket.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertSocketService: AlertSocketService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  enviar() {
    console.log('Enviando alerta desde admin...');
    this.alertSocketService.sendMessage('¡Paciente necesita ayuda!');
  }
}
