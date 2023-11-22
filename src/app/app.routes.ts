import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    title: '404 Not Found'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
