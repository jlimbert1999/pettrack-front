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
      { path: '', pathMatch: 'full', redirectTo: 'owners' },
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
