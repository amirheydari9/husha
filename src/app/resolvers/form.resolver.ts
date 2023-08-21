import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";
import {map, Observable} from "rxjs";
import {BaseInfoService} from "../api/base-info.service";

@Injectable()
export class FormResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private baseInfoService: BaseInfoService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.baseInfoService.fetchForm(new FetchFormDTO(route.params['id'])).pipe(
      map((data) => {
        if (data && data.formKind.id < 100) {
          return data;
        } else {
          this.router.navigate(['/error/404'])
          return null
        }
      })
    )
  }
}
