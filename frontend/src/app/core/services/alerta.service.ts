import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic.service';
import { HttpClient } from '@angular/common/http';
import { Alerta } from '../models/alertas';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AlertaService extends GenericService<Alerta> {
  constructor(http: HttpClient) {
    super(http);
  }
  protected override getBaseUrl(): string {
    return `${environment.apiUrl}/alerta`;
  }
}
