import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
// import { LoginService } from '../service/login.service';

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  return false;
  // const loginService: LoginService = inject(LoginService);
  // const router: Router = inject(Router);

  // return loginService.loginFromServer().pipe(
  //   take(1),
  //   map((result: Boolean) => {
  //     if (result) {
  //       return true;
  //     } else {
  //       return router.createUrlTree(['/403']);
  //     }
  //   })
  // );
};
