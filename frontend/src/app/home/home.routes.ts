// home.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { HomeEnfermeriaComponent } from './home-enfermeria/home-enfermeria.component';
import { HomeMedicoComponent } from './home-medico/home-medico.component';

export const homeRoutes: Routes = [
  {
    path: 'enfermeria',
    component: HomeEnfermeriaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['enfermero'] },
  },
  {
    path: 'medico',
    component: HomeMedicoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['medico'] },
  },
];
