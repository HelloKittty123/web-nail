import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'SYSTEM'
    },
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'user',
        data: {
          title: 'User'
        },
        loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
      }    
    ]
  }
];
