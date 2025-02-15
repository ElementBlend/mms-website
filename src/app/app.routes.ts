import { Routes } from '@angular/router';
// import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Home - MMS - Elementbland',
    loadComponent: () => import('./component/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    title: 'Login Status - MMS - Elementbland',
    loadComponent: () => import('./component/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'download',
    title: 'Modpack Download - MMS - Elementbland',
    loadComponent: () => import('./component/download/download.component').then(m => m.DownloadComponent)
    // canActivate: [authGuard]
  },
  {
    path: 'installation',
    title: 'Installation Guide - MMS - Elementbland',
    loadComponent: () => import('./component/installation/installation.component').then(m => m.InstallationComponent)
    // canActivate: [authGuard]
  },
  {
    path: 'contribute',
    title: 'Contributors - MMS - Elementbland',
    loadComponent: () => import('./component/contribute/contribute.component').then(m => m.ContributeComponent)
  },
  {
    path: 'certificate',
    title: 'Certificate - MMS - Elementbland',
    loadComponent: () => import('./component/certificate/certificate.component').then(m => m.CertificateComponent)
  },
  {
    path: 'application',
    title: 'Application Form - MMS - Elementbland',
    loadComponent: () => import('./component/application/application.component').then(m => m.ApplicationComponent)
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy - MMS - Elementbland',
    loadComponent: () => import('./component/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'cookie-policy',
    title: 'Cookie Policy - MMS - Elementbland',
    loadComponent: () => import('./component/cookie-policy/cookie-policy.component').then(m => m.CookiePolicyComponent)
  },
  {
    path: '404',
    title: 'Page Not Found - MMS - Elementbland',
    loadComponent: () => import('./component/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
