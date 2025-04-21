import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {
  constructor(protected http: HttpClient) {}

  // Configurar la URL base en la clase hija
  protected getBaseUrl(): string {
    return '';
  }

  // Método para obtener todos los elementos
  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.getBaseUrl()}`)
      .pipe(
        catchError((error) =>
          this.handleError(error, 'No se pudo obtener la lista de elementos')
        )
      );
  }

  // Método para obtener un elemento por ID
  getById(id: string): Observable<T> {
    return this.http
      .get<T>(`${this.getBaseUrl()}/${id}`)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            `No se pudo obtener el elemento con ID: ${id}`
          )
        )
      );
  }

  // Método para agregar un elemento
  add(item: T): Observable<any> {
    return this.http
      .post(`${this.getBaseUrl()}`, item)
      .pipe(
        catchError((error) =>
          this.handleError(error, 'No se pudo añadir el nuevo elemento')
        )
      );
  }

  // Método para actualizar un elemento
  update(id: string, item: T): Observable<any> {
    return this.http
      .put(`${this.getBaseUrl()}/${id}`, item)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            `No se pudo actualizar el elemento con ID: ${id}`
          )
        )
      );
  }

  // Método para eliminar un elemento
  delete(id: string): Observable<any> {
    return this.http
      .delete(`${this.getBaseUrl()}/${id}`)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            `No se pudo eliminar el elemento con ID: ${id}`
          )
        )
      );
  }

  // Método genérico para manejar errores
  protected handleError(
    error: HttpErrorResponse,
    operation: string
  ): Observable<never> {
    let errorMessage = '';

    if (error.error && error.error.message) {
      // Error del lado del cliente o de la red
      errorMessage = `${operation} - Error del cliente o de la red: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `${operation} - Error del servidor: Código ${error.status}, mensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
