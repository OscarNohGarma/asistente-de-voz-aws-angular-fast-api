// alert-socket.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class AlertSocketService {
  private socket: WebSocketSubject<string>;

  constructor() {
    // Conectar el socket tan pronto se cree el servicio
    this.socket = webSocket('ws://localhost:8000/ws/alertas');
    this.socket.subscribe({
      next: (msg) => console.log('Mensaje desde backend:', msg),
      error: (err) => console.error('Error en socket:', err),
      complete: () => console.log('Socket cerrado'),
    });
  }

  sendMessage(msg: string) {
    console.log('Enviando mensaje al socket:', msg);
    this.socket.next(msg);
  }

  getMessages() {
    return this.socket.asObservable();
  }
}
