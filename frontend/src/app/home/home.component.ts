import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../common/header/header.component';
import { AuthService } from '../auth/auth.service';
import { SweetAlertService } from '../core/services/sweet-alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  nombreUsuario: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private swal: SweetAlertService
  ) {}
  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';
  }
  handleLogout() {
    this.swal
      .confirm('¿Deseas cerrar sesión?', '¿Cerrar la sesión actual  ?')
      .then((result) => {
        if (result) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
  }
}
