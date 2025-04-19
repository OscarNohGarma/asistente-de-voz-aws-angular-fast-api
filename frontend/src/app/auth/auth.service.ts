// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  login(id: string, token: string, rol: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      console.log('Leyendo token desde localStorage:', token);
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
