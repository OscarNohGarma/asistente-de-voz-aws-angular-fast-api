import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth.guard';
import path from 'path';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard], // Protegido por el guard de admin

    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        title: 'Administrador - Geriatría',
      },
      {
        path: 'agregar-usuario',
        component: UsuarioFormComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        title: 'Agregar usuario - Geriatría',
      },
      {
        path: 'editar-usuario',
        component: UsuarioFormComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        title: 'Agregar usuario - Geriatría',
      },
    ],
  },
];
