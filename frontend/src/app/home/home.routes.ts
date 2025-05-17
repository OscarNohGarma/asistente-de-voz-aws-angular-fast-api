// home.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { HomeEnfermeriaComponent } from './home-enfermeria/home-enfermeria.component';
import { HomeMedicoComponent } from './home-medico/home-medico.component';
import { PacienteFormComponent } from './home-medico/paciente-form/paciente-form.component';
import { HomeComponent } from './home.component';
import { RedirectComponent } from '../common/redirect/redirect.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'redirigir',
      },
      {
        path: 'redirigir',
        component: RedirectComponent, // este lo creas tú
      },
      {
        path: 'enfermeria',
        component: HomeEnfermeriaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['enfermero'] },
        title: 'Enfermería - Geriatría',
      },
      {
        path: 'medico',
        component: HomeMedicoComponent,
        canActivate: [AuthGuard],
        data: { roles: ['medico'] },
        title: 'Médico - Geriatría',
      },
      {
        path: 'medico/alta-paciente',
        component: PacienteFormComponent,
        canActivate: [AuthGuard],
        data: { roles: ['medico'] },
        title: 'Alta de paciente - Geriatría',
      },
    ],
  },
];
