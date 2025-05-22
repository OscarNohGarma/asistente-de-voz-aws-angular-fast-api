import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../core/services/paciente.service';
import { environment } from '../../../environment/environment';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from '../../../common/spinner/spinner.component';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.scss',
})
export class PacienteFormComponent implements OnInit {
  sendForm: FormGroup;
  submitted = false;
  nombre_completo: string = '';
  edad: number = 0;
  habitacion: string = '';
  diagnostico: string = '';
  fecha_ingreso: string = '';
  activo: boolean = false;
  telefono_familiar: string = '';
  correo_familiar: string = '';
  selectedFile: File | null = null;
  editting: boolean = false;
  currentId: string = '';
  fotoUrl: string = '';
  loading = false;
  previewUrl: string | ArrayBuffer | null = ''; // Para la vista previa de la imagen
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private swal: SweetAlertService
  ) {
    this.sendForm = this.fb.group({
      nombre_completo: ['', [Validators.required]],
      edad: [null, [Validators.required, Validators.min(1)]], // 👈 edad > 0
      habitacion: ['', [Validators.required]],
      diagnostico: ['', [Validators.required]],
      fecha_ingreso: ['', [Validators.required]],
      telefono_familiar: ['', [Validators.required]],
      correo_familiar: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentId = params['id'];
      if (this.currentId) {
        this.pacienteService.getById(this.currentId).subscribe((paciente) => {
          this.sendForm.patchValue(paciente);
          this.fotoUrl = `${environment.apiUrl}${paciente.foto_url}`;
          this.previewUrl = this.fotoUrl; // Mostrar la foto actual si está en edición
          this.editting = true;
        });
      }
    });
  }
  get f() {
    return this.sendForm.controls;
  }

  errorFile: string = '';
  // Maneja la selección del archivo y muestra la vista previa
  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension || !allowedExtensions.includes(extension)) {
        this.errorFile =
          'Error: Solo se aceptan archivos de imagen (jpg, jpeg, png, gif, webp)';
        this.selectedFile = null;
        this.previewUrl = '';
        return;
      }

      // Si es válido, limpia el error y carga la imagen
      this.errorFile = '';
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Envia el formulario
  onSubmit() {
    this.submitted = true;
    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched();
      this.swal.error('Por favor, rellena todos los campos correctamente.');
      return;
    }
    this.loading = true;
    const formData = new FormData();
    Object.keys(this.sendForm.value).forEach((key) => {
      formData.append(key, this.sendForm.value[key]);
    });

    formData.append('activo', 'true');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    } else {
      if (!this.editting) {
        this.loading = false;
        this.swal.error('La foto de paciente es obligatoria.');
        return;
      }
    }
    if (this.editting) {
      this.http
        .put(`${environment.apiUrl}/paciente/${this.currentId}`, formData)
        .subscribe(
          (response) => {
            setTimeout(() => {
              console.log('Paciente actualizado:', response);
              this.loading = false;
              this.swal
                .success('Paciente actualizado correctamente.')
                .then((result) => {
                  this.router.navigate(['home/medico']);
                });
            }, 1000);
          },
          (error) => {
            this.swal.error('Error al actualizar paciente.');
            console.error('Error al actualizar paciente:', error);
            this.loading = false;
          }
        );
    } else {
      this.http.post(`${environment.apiUrl}/paciente`, formData).subscribe(
        (response) => {
          setTimeout(() => {
            this.loading = false;
            this.swal
              .success('Paciente dado de alta correctamente.')
              .then((result) => {
                this.router.navigate(['home/medico']);
              });
          }, 1000);
        },
        (error) => {
          this.swal.error('Error al dar de alta al paciente.');
          console.error('Error al insertar paciente:', error);
          this.loading = false;
        }
      );
    }
  }
}
