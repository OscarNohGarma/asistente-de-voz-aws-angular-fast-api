import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic.service';
import { Paciente } from '../models/paciente';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PacienteService extends GenericService<Paciente> {
  constructor(http: HttpClient) {
    super(http);
  }
  protected override getBaseUrl(): string {
    return `${environment.apiUrl}/paciente`;
  }
}
