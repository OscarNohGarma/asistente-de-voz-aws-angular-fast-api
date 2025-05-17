// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { homeRoutes } from './home/home.routes';
import { AuthGuard } from './auth/auth.guard';
import { RedirectComponent } from './common/redirect/redirect.component';
import { AudioRecorderComponent } from './common/audio-recorder/audio-recorder.component';
import { UsuarioFormComponent } from './admin/usuario-form/usuario-form.component';
import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    children: adminRoutes,
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
