import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-redirect',
  template: '',
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const rol = this.authService.getRol();

    switch (rol) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'medico':
        this.router.navigate(['/home/medico']);
        break;
      case 'enfermero':
        this.router.navigate(['/home/enfermeria']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
