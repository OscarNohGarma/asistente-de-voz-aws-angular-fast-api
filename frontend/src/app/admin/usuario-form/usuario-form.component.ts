import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from '../../common/spinner/spinner.component';
import { Usuario } from '../../core/models/usuario';
import { getLocalISOStringWithMicroseconds } from '../../core/functions/functions';
import { SweetAlertService } from '../../core/services/sweet-alert.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss',
})
export class UsuarioFormComponent implements OnInit {
  sendForm: FormGroup;
  listaUsuarios: Usuario[] = [];
  submitted = false;
  nombre_completo: string = '';
  correo: number = 0;
  contrasena: number = 0;
  rol: string = '';
  fecha_ingreso: string = '';
  activo: boolean = false;
  editting: boolean = false;
  currentId: string = '';
  currentUsuario: any;
  loading = false;
  error = '';
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private swal: SweetAlertService
  ) {
    this.sendForm = this.fb.group(
      {
        nombre_completo: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.required]],
        confirmar_contrasena: ['', [Validators.required]],
        rol: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        console.log(this.listaUsuarios);
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de usuarios', err);
        this.swal.error('No se pudo obtener la lista de usuarios');
      },
    });
    this.route.queryParams.subscribe((params) => {
      this.currentId = params['id'];
      if (this.currentId) {
        this.usuarioService.getById(this.currentId).subscribe((usuario) => {
          this.sendForm.patchValue({
            ...usuario,
            confirmar_contrasena: usuario.contrasena, // <-- aquí
          });
          this.currentUsuario = usuario;
          this.editting = true;
        });
      }
    });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena');
    const confirmPassword = form.get('confirmar_contrasena');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      // Solo limpiar mismatch, pero conservar otros errores (ej: required)
      if (confirmPassword?.errors) {
        const { mismatch, ...otherErrors } = confirmPassword.errors;
        if (Object.keys(otherErrors).length === 0) {
          confirmPassword.setErrors(null);
        } else {
          confirmPassword.setErrors(otherErrors);
        }
      }
    }

    return null; // Porque ya seteamos el error en el control directamente
  }

  get f() {
    return this.sendForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched();
      this.swal.error('Por favor, rellena todos los campos correctamente.');
      return;
    }

    this.loading = true;
    const correoDuplicado = this.listaUsuarios.filter(
      (usuario) =>
        usuario.correo === this.sendForm.value.correo &&
        (!this.editting || usuario.id.toString() !== this.currentId)
    );

    if (correoDuplicado.length !== 0) {
      this.error = 'El correo ya está registrado';
      this.swal.error('Ya existe un usuario con este correo.');
      this.loading = false;
      return;
    }

    const { confirmar_contrasena, ...formValues } = this.sendForm.value;

    this.error = '';
    const nuevoUsuario = {
      ...formValues,
      activo: true,
      fecha_creacion: this.editting
        ? this.currentUsuario.fecha_creacion
        : getLocalISOStringWithMicroseconds(),
    };
    if (this.editting) {
      this.usuarioService.update(this.currentId, nuevoUsuario).subscribe({
        next: (data) => {
          setTimeout(() => {
            this.loading = false;
            console.log('El usuario se actualizó correctamente', data);
            this.swal
              .success(`El usuario se actualizó correctamente`)
              .then((result) => {
                this.router.navigate(['/admin']);
              });
          }, 1000);
        },
        error: (err) => {
          setTimeout(() => {
            this.error = 'Ocurrió un error durante la actualización';
            this.swal.error('Ocurrió un error durante la actualización');
            this.loading = false;
          }, 1000);
        },
      });
    } else {
      this.usuarioService.add(nuevoUsuario).subscribe({
        next: (data) => {
          setTimeout(() => {
            this.loading = false;
            console.log('El usuario se agregó correctamente', data);
            this.swal
              .success('El usuario se agregó correctamente')
              .then((result) => {
                this.router.navigate(['/admin']);
              });
          }, 1000);
        },
        error: (err) => {
          setTimeout(() => {
            this.error = 'Ocurrió un error al agregar el usuario';
            this.swal.error('Ocurrió un error al agregar el usuario');
            this.loading = false;
          }, 1000);
        },
      });
    }
  }
}
