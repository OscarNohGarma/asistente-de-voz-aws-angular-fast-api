import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PacienteService } from '../../../core/services/paciente.service';
import { environment } from '../../../environment/environment';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.scss',
})
export class PacienteFormComponent {
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private pacienteService: PacienteService
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
  get f() {
    return this.sendForm.controls;
  }
  // Maneja la selección del archivo
  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
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
    const formData = new FormData();
    Object.keys(this.sendForm.value).forEach((key) => {
      formData.append(key, this.sendForm.value[key]);
    });

    formData.append('activo', 'true');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }
    this.http.post(`${environment.apiUrl}/paciente`, formData).subscribe(
      (response) => {
        console.log('Paciente insertado:', response);
      },
      (error) => {
        console.error('Error al insertar paciente:', error);
      }
    );
  }
}
