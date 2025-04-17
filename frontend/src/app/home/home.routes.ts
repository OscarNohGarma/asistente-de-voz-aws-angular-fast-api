// home.routes.ts
import { Routes } from '@angular/router';
import { EnfermeroComponent } from './enfermero/enfermero.component';
import { MedicoComponent } from './medico/medico.component';
import { AuthGuard } from '../auth/auth.guard';

export const homeRoutes: Routes = [
  {
    path: 'enfermeria',
    component: EnfermeroComponent,
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
