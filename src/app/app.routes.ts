import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Inicio',
    path: 'home',
    loadComponent: () =>
      import('./layout/presentation/pages/home/home.component'),
    children: [
      {
        title: 'Mascotas',
        path: 'pets',
        loadComponent: () =>
          import('./pets/presentation/pages/pets-manage/pets-manage.component'),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
