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

    console.log('Token:', token);
    console.log('Rol:', rol);

    if (!token || !rol) {
      console.log('No autenticado, redirigiendo...');
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];
    if (allowedRoles && !allowedRoles.includes(rol)) {
      console.log('Rol no permitido, redirigiendo...');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('Autenticado y rol permitido');
    return true;
  }
}
