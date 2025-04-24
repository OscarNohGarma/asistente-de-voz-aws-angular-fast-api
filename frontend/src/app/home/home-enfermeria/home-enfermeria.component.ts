import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertCardComponent } from '../../common/alert-card/alert-card.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../common/header/header.component';
import { AlertListComponent } from '../../common/alert-list/alert-list.component';

@Component({
  selector: 'app-home-enfermeria',
  standalone: true,
  imports: [
    CommonModule,
    AlertCardComponent,
    HeaderComponent,
    AlertListComponent,
  ],
  templateUrl: './home-enfermeria.component.html',
  styleUrls: ['./home-enfermeria.component.scss'],
})
export class HomeEnfermeriaComponent implements OnInit {
  nombreUsuario: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';
  }

  alertas = [
    {
      paciente: 'María Gómez',
      fotoUrl:
        'https://www.dzoom.org.es/wp-content/uploads/2019/09/portada-retratos-personas-mayores-ancianos-vejez-retrato-fotografia-810x540.jpg',
      alerta: 'Palabra clave: ayuda',
      hora: '10:42 AM',
    },
    {
      paciente: 'Luis Pérez',
      fotoUrl:
        'https://media.istockphoto.com/id/158636081/es/foto/hombre-real.jpg?s=170667a&w=0&k=20&c=SLo9t_3_vDvB-p3gnEtoxZdfAAbHWicCigDS4yegJ9I=',
      alerta: 'Palabra clave: dolor',
      hora: '11:10 AM',
    },
  ];
  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
