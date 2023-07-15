import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, tap} from 'rxjs';
import {TokenStorageService} from "../utils/token-storage.service";


@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.tokenStorageService.getToken()) return this.router.navigate(['auth'])
    return true

    // else {
    //   return this.authFacade.currentUser$.pipe(
    //     map((data) => {
    //       console.log(data)
    //       if (!data) this.router.navigate(['auth'])
    //       return true
    //     })
    //   )
    // }

    // return this.authFacade.isLoggedIn$.pipe(
    //   tap(async (data) => {
    //     if (!data) await this.router.navigate(['auth'])
    //     return true
    //   })
    // )
  }
}
