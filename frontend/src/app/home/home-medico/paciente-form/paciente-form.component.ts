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
    private router: Router
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

  // Maneja la selección del archivo y muestra la vista previa
  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Crear una vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result; // Aquí se obtiene la URL de la imagen seleccionada
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Envia el formulario
  onSubmit() {
    this.submitted = true;
    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched();
      console.log('aborting');

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
      if (!this.editting) return;
    }
    if (this.editting) {
      this.http
        .put(`${environment.apiUrl}/paciente/${this.currentId}`, formData)
        .subscribe(
          (response) => {
            setTimeout(() => {
              console.log('Paciente actualizado:', response);
              this.loading = false;
              this.router.navigate(['home/medico']);
            }, 1000);
          },
          (error) => {
            console.error('Error al actualizar paciente:', error);
            this.loading = false;
          }
        );
    } else {
      this.http.post(`${environment.apiUrl}/paciente`, formData).subscribe(
        (response) => {
          setTimeout(() => {
            console.log('Paciente insertado:', response);
            this.loading = false;
            this.router.navigate(['home/medico']);
          }, 1000);
        },
        (error) => {
          console.error('Error al insertar paciente:', error);
          this.loading = false;
        }
      );
    }
  }
}
