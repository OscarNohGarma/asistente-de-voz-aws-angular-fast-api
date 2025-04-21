import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../core/models/usuario';
import { UsuarioService } from '../core/services/usuario.service';
import { log } from 'console';
import { filter } from 'rxjs';
import { SpinnerComponent } from '../common/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  providers: [UsuarioService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loginError = '';
  usuarioItems: Usuario[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarioItems = data;
        console.log(this.usuarioItems);
      },
      error: (err) => {
        console.error('Error al obtener los usuarios', err);
      },
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

    // Si los usuarios no están cargados
    if (this.usuarioItems.length === 0) {
      this.loginError =
        'No se puede iniciar sesión en este momento. Intenta más tarde.';
      return;
    }

    this.loading = true;
    this.loginError = '';

    const { email, password } = this.loginForm.value;

    const foundUser = this.usuarioItems.filter(
      (usuario) => usuario.correo == email
    );

    setTimeout(() => {
      if (foundUser.length != 0 && foundUser[0].contrasena == password) {
        const userRol = foundUser[0].rol;
        this.authService.login('123123123', 'mock-jwt-token', userRol);
        this.loading = false;
        this.redirectUserByRole(userRol);
      } else {
        this.loginError = 'Credenciales inválidas';
        this.loading = false;
      }
    }, 800);
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
