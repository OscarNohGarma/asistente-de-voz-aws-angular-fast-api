import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service'; // Asegúrate de ajustar la ruta según la ubicación de tu AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    // Simular autenticación exitosa (reemplazar por llamada real a AuthService)
    if (email === 'admin@ejemplo.com' && password === 'admin123') {
      const mockRol = 'medico'; // Esto lo deberías recibir del backend

      this.authService.login('123123123', 'mock-jwt-token', mockRol);

      this.redirectUserByRole(mockRol);
    } else {
      this.loginError = 'Credenciales inválidas';
    }
  }

  redirectUserByRole(rol: string) {
    switch (rol) {
      case 'admin':
        this.router.navigate(['/admin']);
        console.log('adminnnnn');

        break;
      case 'medico':
        this.router.navigate(['/home/medico']);
        break;
      case 'enfermero':
        this.router.navigate(['/home/enfermeria']);
        break;
      default:
        this.loginError = 'Rol no reconocido.';
        break;
    }
  }
}
