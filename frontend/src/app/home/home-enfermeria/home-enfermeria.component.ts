import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertCardComponent } from '../../common/alert-card/alert-card.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../common/header/header.component';
import { AlertListComponent } from '../../common/alert-list/alert-list.component';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../core/models/alertas';

@Component({
  selector: 'app-home-enfermeria',
  standalone: true,
  imports: [
    CommonModule,
    AlertCardComponent,
    HeaderComponent,
    AlertListComponent,
  ],
  providers: [AlertaService],
  templateUrl: './home-enfermeria.component.html',
  styleUrls: ['./home-enfermeria.component.scss'],
})
export class HomeEnfermeriaComponent implements OnInit {
  nombreUsuario: string = '';
  alertaItems: Alerta[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';
    this.alertaService.getAll().subscribe({
      next: (data) => {
        this.alertaItems = data.filter(
          (alerta) => alerta.estado == 'pendiente'
        );
        console.log(this.alertaItems);
      },
      error: (err) => {
        console.error('Error al obtener los usuarios', err);
      },
    });
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
