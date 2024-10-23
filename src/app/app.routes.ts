import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { LoginComponent } from './component/login/login.component';
import { DownloadComponent } from './component/download/download.component';
import { authGuard } from './guard/auth.guard';
import { ContributeComponent } from './component/contribute/contribute.component';
import { CertificateComponent } from './component/certificate/certificate.component';

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
