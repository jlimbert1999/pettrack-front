import { Routes } from '@angular/router';
import {
  isAuthenticatedGuard,
  isNotAuthenticatedGuard,
} from './layout/presentation/guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Autentificacion',
    canActivate: [isNotAuthenticatedGuard],
    loadComponent: () =>
      import('./auth/presentation/pages/login/login.component'),
  },
  {
    title: 'Inicio',
    path: 'home',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./layout/presentation/pages/home/home.component'),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'owners' },
      {
        title: 'Configuraciones',
        path: 'settings',
        loadComponent: () => import('./layout/presentation/pages/user-settings/user-settings'),
      },
      {
        title: 'Propietarios',
        path: 'owners',
        loadComponent: () =>
          import(
            './pets/presentation/pages/owners-manage/owners-manage.component'
          ),
      },
      {
        title: 'Mascotas',
        path: 'pets',
        loadComponent: () =>
          import('./pets/presentation/pages/pets-manage/pets-manage.component'),
      },
      {
        title: 'Usuarios',
        path: 'users',
        loadComponent: () =>
          import(
            './users/presentation/pages/users-manage/users-manage.component'
          ),
      },
      {
        title: 'Centros',
        path: 'centers',
        loadComponent: () =>
          import(
            './administration/presentation/pages/medical-centers-manage/medical-centers-manage.component'
          ),
      },
      {
        path: 'treatments',
        loadComponent: () =>
          import(
            './administration/presentation/pages/types-treatments-manage/types-treatments-manage.component'
          ),
      },
      {
        path: 'breeds',
        loadComponent: () =>
          import(
            './administration/presentation/pages/breeds-manage/breeds-manage.component'
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
