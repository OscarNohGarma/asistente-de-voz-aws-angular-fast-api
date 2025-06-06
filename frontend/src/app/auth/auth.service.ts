// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  login(id: string, nombre: string, token: string, rol: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('id', id);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
    }
  }

  getId(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('id');
    }
    return null;
  }

  getNombre(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('nombre');
    }
    return null;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      return token;
    }
    return null;
  }

  getRol(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('rol');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('id');
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
    }
  }
}
