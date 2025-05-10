import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../common/header/header.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  nombreUsuario: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';
  }
  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
