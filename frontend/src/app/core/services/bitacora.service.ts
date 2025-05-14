import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic.service';
import { Bitacora } from '../models/bitacora';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class BitacoraService extends GenericService<Bitacora> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override getBaseUrl(): string {
    return `${environment.apiUrl}/bitacora`;
  }
}
