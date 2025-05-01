// home.routes.ts
import { Routes } from '@angular/router';
import { MedicoComponent } from './medico/medico.component';
import { AuthGuard } from '../auth/auth.guard';
import { HomeEnfermeriaComponent } from './home-enfermeria/home-enfermeria.component';

export const homeRoutes: Routes = [
  {
    path: 'enfermeria',
    component: HomeEnfermeriaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['enfermero'] },
  },
  {
    path: 'medico',
    component: MedicoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['medico'] },
  },
];
