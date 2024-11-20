import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './layout/presentation/guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Autentificacion',
    // canActivate: [isNotAuthenticatedGuard],
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
        title: 'Mascotas',
        path: 'pets/:id',
        loadComponent: () =>
          import(
            './pets/presentation/pages/pets-manage/pet-detail/pet-detail.component'
          ),
      },
      {
        title: 'Usuarios',
        path: 'users',
        loadComponent: () =>
          import(
            './users/presentation/pages/users-manage/users-manage.component'
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
