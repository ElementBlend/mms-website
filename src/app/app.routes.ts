import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { DownloadComponent } from './download/download.component';
import { authGuard } from './auth.guard';
import { ContributeComponent } from './contribute/contribute.component';
import { CertificateComponent } from './certificate/certificate.component';

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
    path: 'contribute',
    component: ContributeComponent,
    title: 'Contribute'
  },
  {
    path: 'certificate',
    component: CertificateComponent,
    title: 'Certificate'
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    title: 'Not Found'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
