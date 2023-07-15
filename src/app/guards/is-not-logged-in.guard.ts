import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, tap} from 'rxjs';
import {TokenStorageService} from "../utils/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class IsNotLoggedInGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this.authFacade.currentUser$.pipe(
    //   map((data) => {
    //     if (data) this.router.navigate(['/'])
    //     return true
    //   })
    // )

    if (this.tokenStorageService.getToken()) return this.router.navigate(['/'])
    return true
    // return this.authFacade.isLoggedIn$.pipe(
    //   tap(async (data) => {
    //     if (data) await this.router.navigate(['/'])
    //     return true
    //   })
    // )
  }

}
