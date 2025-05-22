import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../../core/services/audio.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../core/services/paciente.service';
import { Paciente } from '../../../core/models/paciente';
import { SpinnerComponent } from '../../../common/spinner/spinner.component';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-agregar-voz',
  standalone: true,
  imports: [FormsModule, CommonModule, SpinnerComponent],
  templateUrl: './agregar-voz.component.html',
  styleUrl: './agregar-voz.component.scss',
})
export class AgregarVozComponent implements OnInit {
  selectedFile?: File;
  pacienteId?: number;
  listaPacientes: Paciente[] = [];
  loading: boolean = false;

  constructor(
    private audioService: AudioService,
    private pacienteService: PacienteService,
    private swal: SweetAlertService
  ) {}
  ngOnInit(): void {
    this.pacienteService.getAll().subscribe({
      next: (data) => {
        this.listaPacientes = data;
      },
      error: (err) => {
        console.log('Error al obtener los pacientes', err);
        this.swal.error('No se pudo obtener la lista de pacientes');
      },
    });
  }

  selectedFileName: string = '';

  triggerFileSelect() {
    const inputFile = document.getElementById('audioFile') as HTMLInputElement;
    if (inputFile) {
      inputFile.click();
    }
  }

  errorFile: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension !== 'wav') {
        this.errorFile = 'Error: Solo se aceptan archivos .wav';
        this.selectedFile = undefined;
        this.selectedFileName = '';
      } else {
        this.errorFile = '';
        this.selectedFile = file;
        this.selectedFileName = file.name;
      }
    } else {
      this.errorFile = '';
      console.log('xd');

      this.selectedFile = undefined;
      this.selectedFileName = '';
    }
  }
  submitted = false;
  onSubmit() {
    this.submitted = true;
    if (!this.pacienteId) {
      this.loading = false;
      this.swal.error('Por favor, rellena los campos correctamente.');
      return;
    }
    if (!this.selectedFile || this.errorFile) {
      this.errorFile = 'Selecciona un archivo válido';
      this.loading = false;
      this.swal.error(
        'Por favor, selecciona un archivo para asociar al paciente.'
      );
      return;
    }

    // Si todo está bien, subir el archivo
    this.swal
      .confirm('¿Deseas asociar el audio seleccionado con este paciente?')
      .then((result) => {
        if (result) {
          this.loading = true;
          this.audioService
            .subirAudio(this.pacienteId!, this.selectedFile!)
            .subscribe({
              next: (res) => {
                this.loading = false;
                setTimeout(() => {
                  this.swal
                    .success('Audio subido con éxito.')
                    .then((result) => {
                      window.location.reload();
                    });
                }, 100);

                // console.log(res);
              },
              error: (err) => {
                this.loading = false;
                this.swal.error('Ocurrió un error al agregar el audio.');
              },
            });
        }
      });
  }
}
