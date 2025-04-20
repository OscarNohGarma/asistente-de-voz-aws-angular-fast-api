import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enfermero',
  standalone: true,
  imports: [],
  templateUrl: './enfermero.component.html',
  styleUrl: './enfermero.component.scss',
})
export class EnfermeroComponent {
  constructor(private router: Router, private authService: AuthService) {}
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
