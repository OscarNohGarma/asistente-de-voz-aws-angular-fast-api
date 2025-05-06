// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { homeRoutes } from './home/home.routes';
import { AuthGuard } from './auth/auth.guard';
import { RedirectComponent } from './common/redirect/redirect.component';
import { AudioRecorderComponent } from './common/audio-recorder/audio-recorder.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'home',
    children: homeRoutes,
  },

  {
    path: 'audio-recorder',
    component: AudioRecorderComponent,
  },
  { path: '', component: RedirectComponent }, // <--- Aquí el cambio importante
  { path: '**', component: RedirectComponent },
];
