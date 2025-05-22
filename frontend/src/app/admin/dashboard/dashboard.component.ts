import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../core/models/usuario';
import { UsuarioService } from '../../core/services/usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { PacienteService } from '../../core/services/paciente.service';
import { Paciente } from '../../core/models/paciente';
import { Alerta } from '../../core/models/alertas';
import { AlertaService } from '../../core/services/alerta.service';
import { AgregarVozComponent } from './agregar-voz/agregar-voz.component';
import { SweetAlertService } from '../../core/services/sweet-alert.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AgregarVozComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  listaUsuarios: Usuario[] = [];
  listaPacientes: Paciente[] = [];
  listaAlertas: Alerta[] = [];
  vista: string = 'dashboard';
  constructor(
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService,
    private alertaService: AlertaService,
    private router: Router,
    private authService: AuthService,
    private swal: SweetAlertService
  ) {}

  ngOnInit(): void {
    const vistaGuardada = localStorage.getItem('adminTab') as
      | 'dashboard'
      | 'usuarios'
      | 'pacientes'
      | 'voz';
    this.vista = vistaGuardada ?? 'dashboard';
    this.cargarUsuarios();
    this.cargarPacientes();
    this.cargarAlertas();
  }
  cargarUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.listaUsuarios = data.filter(
          (usuario) =>
            usuario.id.toString() !== this.authService.getId() && usuario.activo
        );
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de usuarios', err);
        this.swal.error('No se pudo obtener la lista de usuarios');
      },
    });
  }
  cargarPacientes() {
    this.pacienteService.getAll().subscribe({
      next: (data) => {
        this.listaPacientes = data.filter((paciente) => paciente.activo);
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de pacientes', err);
        this.swal.error('No se pudo obtener la lista de pacientes');
      },
    });
  }
  cargarAlertas() {
    this.alertaService.getAll().subscribe({
      next: (data) => {
        this.listaAlertas = data;
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de pacientes', err);
        this.swal.error('No se pudo obtener la lista de pacientes');
      },
    });
  }
  filtarAlertasActivas() {
    return this.listaAlertas.filter((alerta) => alerta.estado !== 'confirmada');
  }
  selectVista(vista: string) {
    this.vista = vista;
    localStorage.setItem('adminTab', vista);
  }
  handleAddUsuario() {
    this.router.navigate(['/admin/agregar-usuario']);
  }
  handleDeleteUsuario(usuario: Usuario) {
    this.swal
      .confirm(
        'La acción no se puede deshacer.',
        '¿Dar de baja a este usuario?'
      )
      .then((confirmed) => {
        if (confirmed) {
          const nuevoUsuario = { ...usuario, activo: false };
          console.log(nuevoUsuario.id);
          this.usuarioService
            .update(nuevoUsuario.id.toString(), nuevoUsuario)
            .subscribe({
              next: (data) => {
                setTimeout(() => {
                  this.swal
                    .success('El usuario se dio de baja correctamente')
                    .then((result) => {
                      this.cargarUsuarios();
                    });
                }, 500);
              },
              error: (err) => {
                console.log('Ocurrió un error al actualizar el usuario', err);
                this.swal.error('Ocurrió un error al actualizar el usuario');
              },
            });
        }
      });
  }
  editarUsuario(usuario: Usuario) {
    this.router.navigate(['/admin/editar-usuario'], {
      queryParams: { id: usuario.id },
    });
  }
}
