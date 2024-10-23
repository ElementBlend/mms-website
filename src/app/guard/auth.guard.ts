import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { LoginService } from '../service/login.service';

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);

  if (loginService.getIdentityStatus() === false) {
    return loginService.loginFromServer().pipe(
      take(1),
      map((result: Boolean) => {
        if (result) {
          return true;
        } else {
          return router.createUrlTree(['/404']);
        }
      })
    );
  } else {
    return true;
    // return loginService.loginByTokenFromServer().pipe(
    //   take(1),
    //   map((result: Boolean) => {
    //     if (result) {
    //       return true;
    //     } else {
    //       return router.createUrlTree(['/404']);
    //     }
    //   })
    // );
  }
};
