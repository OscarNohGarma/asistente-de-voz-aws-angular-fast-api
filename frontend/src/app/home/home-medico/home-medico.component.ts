import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Si usas directivas comunes
import { SpinnerComponent } from '../../common/spinner/spinner.component';
import { HeaderComponent } from '../../common/header/header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { PacienteService } from '../../core/services/paciente.service';
import { Paciente } from '../../core/models/paciente';
import { BitacoraService } from '../../core/services/bitacora.service';
import { Bitacora } from '../../core/models/bitacora';
import { environment } from '../../environment/environment';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../core/models/alertas';
import { AlertSocketService } from '../../core/services/alert-socket.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { getLocalISOStringWithMicroseconds } from '../../core/functions/functions';

@Component({
  selector: 'app-home-medico',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SpinnerComponent], // Importar lo que necesites
  templateUrl: './home-medico.component.html',
  styleUrls: ['./home-medico.component.scss'],
})
export class HomeMedicoComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private authService: AuthService,
    private pacienteService: PacienteService,
    private bitacoraService: BitacoraService,
    private alertSocketService: AlertSocketService,
    private http: HttpClient,
    private alertaService: AlertaService,
    private ngZone: NgZone // Inyectamos NgZone
  ) {}

  nombreUsuario: string = '';
  tab: 'solicitudes' | 'pacientes' = 'solicitudes';
  listaPacientes: Paciente[] = [];
  listaBitacora: Bitacora[] = [];
  listaBitacoraEscaladas: Bitacora[] = [];
  listaAlertas: Alerta[] = [];
  mensajes: string[] = [];
  private sub!: Subscription;
  userInteracted = false;
  loading: boolean = false;

  ngOnInit(): void {
    const nombre = this.authService.getNombre();
    this.nombreUsuario = nombre ?? 'Usuario';

    const tabGuardada = localStorage.getItem('medicoTab') as
      | 'solicitudes'
      | 'pacientes';
    this.tab = tabGuardada ?? 'solicitudes';

    this.cargarPacientes();
    this.cargarBitacoras();
    this.cargarAlertas();
    this.recibirAlerta();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  recibirAlerta() {
    this.sub = this.alertSocketService.getMessages().subscribe((msg) => {
      console.log('Alerta recibida:', msg);
      if (msg === 'escalamiento') {
        this.mensajes.push('¡Un paciente necesita ayuda!');
        // Reproducir sonido de alerta
        this.reproducirSonido();
        // Recargar las alertas
        this.ngZone.run(() => {
          this.cargarAlertas();
          this.cargarBitacoras(); // <<--- AÑADE ESTA LÍNEA
        });

        setTimeout(() => {
          this.mensajes.shift();
        }, 5000);
      }
    });
  }
  cargarAlertas() {
    this.alertaService.getAll().subscribe({
      next: (data) => {
        this.listaAlertas = data.filter(
          (alerta) => alerta.estado === 'escalada'
        );
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de bitácoras', err);
      },
    });
  }
  cargarPacientes() {
    this.pacienteService.getAll().subscribe({
      next: (data) => {
        this.listaPacientes = data.filter(
          (paciente) => paciente.activo === true
        );
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de pacientes', err);
      },
    });
  }
  cargarBitacoras() {
    this.bitacoraService.getAll().subscribe({
      next: (data) => {
        this.listaBitacora = data;
        this.listaBitacoraEscaladas = data.filter(
          (bitacora) =>
            bitacora.accion === 'escalado' &&
            bitacora.alerta?.estado !== 'confirmada'
        );
      },
      error: (err) => {
        console.log('No se pudo obtener la lista de bitácoras', err);
      },
    });
  }

  alertaSeleccionada: any = null;
  bitacoraSeleccionada: any = null;
  pacienteSeleccionado: any = null;
  bitacorasFiltradas: any = null;
  bitacorasFiltradasSolicitudes: any = null;
  alertasFiltradas: any = null;
  cambiarTab(nuevaTab: 'solicitudes' | 'pacientes') {
    this.tab = nuevaTab;
    localStorage.setItem('medicoTab', nuevaTab);
  }
  seleccionarBitacora(bitacora: any) {
    this.bitacoraSeleccionada = bitacora;
    this.bitacorasFiltradasSolicitudes = this.listaBitacora.filter(
      (bitacora) =>
        bitacora.alerta?.id_paciente ===
        this.bitacoraSeleccionada.alerta?.id_paciente.toString()
    );
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

  getPacienteFotoUrl(fotoUrl: string): string {
    return `${environment.apiUrl}${fotoUrl}`;
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

  reproducirSonido(): void {
    if (!this.userInteracted) return; // Evita reproducir si no ha habido interacción
    const audio = new Audio();
    audio.src = '../../../assets/sounds/alerta.mp3'; // Asegúrate de tener este archivo
    audio.load();
    audio.play();
  }

  handleAddPaciente() {
    localStorage.setItem('medicoTab', this.tab); // Guardar tab actual
    this.router.navigate(['/home/medico/alta-paciente']);
  }
  editarPaciente(paciente: any) {
    this.router.navigate(['/home/medico/alta-paciente'], {
      queryParams: { id: paciente.id },
    });
  }
  handleBajaPaciente(paciente: any) {
    const formData = new FormData();

    // Llenamos todos los campos esperados por el backend
    formData.append('nombre_completo', paciente.nombre_completo);
    formData.append('edad', paciente.edad.toString());
    formData.append('habitacion', paciente.habitacion);
    formData.append('diagnostico', paciente.diagnostico);
    formData.append('fecha_ingreso', paciente.fecha_ingreso); // Asegúrate que esté en formato correcto
    formData.append('telefono_familiar', paciente.telefono_familiar);
    formData.append('correo_familiar', paciente.correo_familiar);
    formData.append('activo', 'false');

    this.loading = true;

    this.http
      .put(`${environment.apiUrl}/paciente/${paciente.id}`, formData)
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            console.log('Paciente dado de baja:', response);
            this.cargarPacientes();
            this.pacienteSeleccionado = null;
            this.loading = false;
          }, 1000);
          // Aquí podrías refrescar la lista o mostrar un mensaje
        },
        error: (error) => {
          console.error('Error al dar de baja al paciente:', error);
          this.loading = false;
        },
      });
  }
  confirmarAtencion() {
    if (!this.bitacoraSeleccionada || !this.bitacoraSeleccionada.alerta) return;
    this.loading = true;
    const nuevaAlerta = {
      ...this.bitacoraSeleccionada.alerta,
      estado: 'confirmada',
    };

    this.alertaService
      .update(this.bitacoraSeleccionada.id_alerta, nuevaAlerta)
      .subscribe({
        next: (data) => {
          console.log('Alerta actualizada', data);
          const nuevaBitacora = new Bitacora(
            0,
            this.bitacoraSeleccionada.id_alerta,
            'atendido-medico',
            this.nombreUsuario,
            this.bitacoraSeleccionada.descripcion,
            getLocalISOStringWithMicroseconds()
          );
          console.log(nuevaBitacora);

          this.bitacoraService.add(nuevaBitacora).subscribe({
            next: (response) => {
              setTimeout(() => {
                console.log('Bitácora enviada con éxito', response);
                this.loading = false;
                this.cargarAlertas();
                this.cargarBitacoras();
                this.alertaSeleccionada = null;
                this.bitacoraSeleccionada = null;
              }, 1000);
            },
            error: (err) => {
              console.error('Error al enviar la bitácora', err);
              this.loading = false;
            },
          });
        },
        error: (err) => {
          console.log('Error al actualizar la alerta', err);
          this.loading = false;
        },
      });
  }
}
