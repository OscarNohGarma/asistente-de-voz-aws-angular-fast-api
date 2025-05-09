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
import { BitacoraService } from '../../core/services/bitacora.service';
import { Bitacora } from '../../core/models/bitacora';
import { environment } from '../../environment/environment';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../core/models/alertas';
import { formatearFechaAlerta } from '../../core/functions/functions';

@Component({
  selector: 'app-home-medico',
  standalone: true,
  imports: [CommonModule, HeaderComponent], // Importar lo que necesites
  templateUrl: './home-medico.component.html',
  styleUrls: ['./home-medico.component.scss'],
})
export class HomeMedicoComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private pacienteService: PacienteService,
    private bitacoraService: BitacoraService,
    private alertaService: AlertaService
  ) {}
  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  nombreUsuario: string = '';
  tab: 'solicitudes' | 'pacientes' = 'solicitudes';
  listaPacientes: Paciente[] = [];
  listaBitacora: Bitacora[] = [];
  listaAlertas: Alerta[] = [];
  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';

    this.pacienteService.getAll().subscribe({
      next: (data) => {
        this.listaPacientes = data;
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de pacientes', err);
      },
    });
    this.bitacoraService.getAll().subscribe({
      next: (data) => {
        this.listaBitacora = data;
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de bitácoras', err);
      },
    });
    this.alertaService.getAll().subscribe({
      next: (data) => {
        this.listaAlertas = data.filter(
          (alerta) => alerta.estado === 'escalada'
        );
        console.log(this.listaAlertas);
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de bitácoras', err);
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
  bitacorasFiltradas: any = null;

  seleccionarAlerta(alerta: any) {
    this.alertaSeleccionada = alerta;
  }
  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;
    console.log(this.pacienteSeleccionado);
    this.bitacorasFiltradas = this.listaBitacora.filter(
      (bitacora) =>
        bitacora.alerta?.id_paciente === this.pacienteSeleccionado.id.toString()
    );
    console.log(this.bitacorasFiltradas);
  }
  filtarBitacoras(id_paciente: string) {
    console.log(id_paciente);
  }

  darAltaNuevoPaciente() {
    alert('Función para dar de alta a un nuevo paciente.');
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
    } de ${anio} a las ${horaNum}:${minuto}:${segundo} ${sufijo}`;
  }

  formatearAlerta(fecha: string) {
    return formatearFechaAlerta(fecha);
  }
  // Resultado: "8 de mayo de 2025 a las 3:58:27 p.m."

  getPacienteFotoUrl(fotoUrl: string): string {
    return `${environment.apiUrl}${fotoUrl}`;
  }
  filtrarAlerta(alerta: Alerta): string {
    const desc = this.listaBitacora.filter(
      (bitacora) =>
        bitacora.id_alerta === alerta.id && bitacora.accion === 'escalado'
    );
    return desc[0].descripcion;
  }
  validarTipoAlerta(tipo: string): string {
    switch (tipo) {
      case 'naranja':
        return '🟠 Naranja';
      case 'rojo':
        return '🔴 Rojo';
      default:
        break;
    }
    return '';
  }
}
