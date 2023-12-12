import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { DownloadComponent } from './download/download.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'download',
    component: DownloadComponent,
    canActivate: [authGuard],
    title: 'Download'
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
