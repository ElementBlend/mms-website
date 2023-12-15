import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { LoginService } from './login.service';

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);
  return loginService.checkLoginTokenFromServer().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/404']);
        return false;
      } else {
        return true;
      }
    })
  );
};
