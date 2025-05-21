import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private apiUrl = 'http://127.0.0.1:8000/audio/guardar';
  private apiUrlActualizarEmbedding =
    'http://127.0.0.1:8000/embedding/actualizar';

  constructor(private http: HttpClient) {}

  subirAudio(idPaciente: number, archivo: File) {
    const formData = new FormData();
    formData.append('id_paciente', idPaciente.toString());
    formData.append('audio_file', archivo, archivo.name);

    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en AudioService:', error);
        return throwError(() => error);
      })
    );
  }
  actualizarEmbeddings() {
    return this.http.post(this.apiUrlActualizarEmbedding, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar embeddings:', error);
        return throwError(() => error);
      })
    );
  }
}
