import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Si usas directivas comunes
import { SpinnerComponent } from '../../common/spinner/spinner.component';
import { HeaderComponent } from '../../common/header/header.component';
import { AppSolicitudesHistorialComponent } from './app-solicitudes-historial/app-solicitudes-historial.component';  // Ajusta el camino
import { AppPacientesListaComponent } from './app-pacientes-lista/app-pacientes-lista.component';  // Ajusta el camino

@Component({
  selector: 'app-home-medico',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, HeaderComponent, AppSolicitudesHistorialComponent, AppPacientesListaComponent],  // Importar lo que necesites
  templateUrl: './home-medico.component.html',
  styleUrls: ['./home-medico.component.scss']
})
export class HomeMedicoComponent {
  nombreUsuario = 'Doctor Juan Pérez';
  tab: 'solicitudes' | 'pacientes' = 'solicitudes';

  alertas = [
    {
      nombre: 'Sr. Juan Pérez',
      habitacion: 12,
      hora: '11:47 AM',
      tipo: 'EMERGENCIA',
      historial: [
        { fecha: '2025-04-14', descripcion: 'Llamó por dolor en el pecho' },
        { fecha: '2025-04-12', descripcion: 'Solicitó asistencia para ir al baño' }
      ]
    },
    // Puedes agregar más alertas aquí
  ];

  alertaSeleccionada: any = null;

  pacientesAlta = [
    { nombre: 'Sra. Marta López', edad: 81, fechaAlta: '2025-04-10' },
    { nombre: 'Sr. Pedro Díaz', edad: 75, fechaAlta: '2025-04-02' }
  ];

  seleccionarAlerta(alerta: any) {
    this.alertaSeleccionada = alerta;
  }

  darAltaNuevoPaciente() {
    alert('Función para dar de alta a un nuevo paciente.');
  }
}
