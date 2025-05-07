import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Si usas directivas comunes
import { SpinnerComponent } from '../../common/spinner/spinner.component';
import { HeaderComponent } from '../../common/header/header.component';
import { AppSolicitudesHistorialComponent } from './app-solicitudes-historial/app-solicitudes-historial.component'; // Ajusta el camino
import { AppPacientesListaComponent } from './app-pacientes-lista/app-pacientes-lista.component'; // Ajusta el camino
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { PacienteService } from '../../core/services/paciente.service';
import { Paciente } from '../../core/models/paciente';

@Component({
  selector: 'app-home-medico',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    HeaderComponent,
    AppSolicitudesHistorialComponent,
    AppPacientesListaComponent,
  ], // Importar lo que necesites
  templateUrl: './home-medico.component.html',
  styleUrls: ['./home-medico.component.scss'],
})
export class HomeMedicoComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private pacienteService: PacienteService
  ) {}

  nombreUsuario: string = '';
  tab: 'solicitudes' | 'pacientes' = 'solicitudes';
  listaPacientes: Paciente[] = [];
  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';
    console.log(this.nombreUsuario);

    this.pacienteService.getAll().subscribe({
      next: (data) => {
        this.listaPacientes = data;
        console.log(this.listaPacientes);
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de pacientes', err);
      },
    });
  }

  alertas = [
    {
      nombre: 'Sr. Juan Pérez',
      habitacion: 12,
      hora: '11:47 AM',
      tipo: 'EMERGENCIA',
      historial: [
        { fecha: '2025-04-14', descripcion: 'Llamó por dolor en el pecho' },
        {
          fecha: '2025-04-12',
          descripcion: 'Solicitó asistencia para ir al baño',
        },
      ],
    },
    {
      nombre: 'Sr. Molly Medina',
      habitacion: 12,
      hora: '09:43 AM',
      tipo: 'EMERGENCIA MENOR',
      historial: [
        { fecha: '2025-04-14', descripcion: 'Llamó por dolor en el pecho' },
        {
          fecha: '2025-04-12',
          descripcion: 'Solicitó asistencia para ir al baño',
        },
      ],
    },
    // Puedes agregar más alertas aquí
  ];

  alertaSeleccionada: any = null;
  pacienteSeleccionado: any = null;

  pacientesAlta = [
    { nombre: 'Sra. Marta López', edad: 81, fechaAlta: '2025-04-10' },
    { nombre: 'Sr. Pedro Díaz', edad: 75, fechaAlta: '2025-04-02' },
  ];

  seleccionarAlerta(alerta: any) {
    this.alertaSeleccionada = alerta;
  }
  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;
    console.log(this.pacienteSeleccionado);
  }

  darAltaNuevoPaciente() {
    alert('Función para dar de alta a un nuevo paciente.');
  }
  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  formatearFecha(fechaStr: string): string {
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    // Extraer fecha y hora del string
    const [fecha, hora] = fechaStr.split(' ');
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const [horaStr, minutoStr, segundoStr] = hora.split(':');

    let horaNum = Number(horaStr);
    const minuto = minutoStr;
    const segundo = segundoStr.split('.')[0]; // quitar los milisegundos

    const sufijo = horaNum >= 12 ? 'pm' : 'am';
    horaNum = horaNum % 12 || 12; // convertir a formato 12 horas

    return `${dia} de ${
      meses[mes - 1]
    } de ${anio} - ${horaNum}:${minuto}:${segundo} ${sufijo}`;
  }
}
