import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { DownloadComponent } from './component/download/download.component';
import { InstallationComponent } from './component/installation/installation.component';
import { ContributeComponent } from './component/contribute/contribute.component';
import { CertificateComponent } from './component/certificate/certificate.component';
import { ApplicationComponent } from './component/application/application.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home - MMS - Elementbland'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login Status - MMS - Elementbland'
  },
  {
    path: 'download',
    component: DownloadComponent,
    canActivate: [authGuard],
    title: 'Modpack Download - MMS - Elementbland'
  },
  {
    path: 'installation',
    component: InstallationComponent,
    canActivate: [authGuard],
    title: 'Installation Guide - MMS - Elementbland'
  },
  {
    path: 'contribute',
    component: ContributeComponent,
    title: 'Contributors - MMS - Elementbland'
  },
  {
    path: 'certificate',
    component: CertificateComponent,
    title: 'Certificate - MMS - Elementbland'
  },
  {
    path: 'application',
    component: ApplicationComponent,
    title: 'Application Form - MMS - Elementbland'
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    title: 'Page Not Found - MMS - Elementbland'
  },
  {
    path: '403',
    component: ForbiddenComponent,
    title: 'Forbidden - MMS - Elementbland'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
