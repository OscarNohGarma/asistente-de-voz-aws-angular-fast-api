import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss',
})
export class MedicoComponent {
  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
