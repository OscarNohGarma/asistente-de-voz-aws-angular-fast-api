// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getToken();
    const rol = this.authService.getRol();

    if (!token || !rol) {
      this.router.navigate(['/login']);
      return false;
    }

    // Manejo especial para rutas públicas como /audio-recorder
    if (this.router.url === '/audio-recorder') {
      return true;
    }

    const allowedRoles = route.data['roles'] as string[];

    if (allowedRoles && !allowedRoles.includes(rol)) {
      // redirige a acceso denegado en vez de login (opcional)
      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
}
