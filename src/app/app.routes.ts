import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { DownloadComponent } from './component/download/download.component';
import { ContributeComponent } from './component/contribute/contribute.component';
import { CertificateComponent } from './component/certificate/certificate.component';
import { InstallationComponent } from './component/installation/installation.component';

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
    path: 'installation',
    component: InstallationComponent,
    canActivate: [authGuard],
    title: 'Installation Guide'
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
    title: 'Page Not Found'
  },
  {
    path: '403',
    component: ForbiddenComponent,
    title: 'Forbidden'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
