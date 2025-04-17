import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard], // Protegido por el guard de admin
  },
];
