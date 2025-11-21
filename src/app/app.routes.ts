import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'core-demo',
    pathMatch: 'full'
  },
  {
    path: 'core-demo',
    loadComponent: () =>
      import('./features/core-demo/core-demo.page').then(
        (m) => m.CoreDemoPage
      )
  },
  {
    path: '**',
    redirectTo: 'core-demo'
  }
];
