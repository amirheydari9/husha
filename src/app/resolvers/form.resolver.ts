import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {BaseInfoFacade} from "../data-core/base-info/base-info.facade";
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";

@Injectable()
export class FormResolver implements Resolve<any> {
  constructor(
    private baseInfoFacade: BaseInfoFacade,
    private router: Router
  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    await this.baseInfoFacade.fetchForm(new FetchFormDTO(route.params['id']))
    return this.baseInfoFacade.form$.subscribe(data => {
      if (data) {
        //TODO اگر کایند ای دی زیر 100 بود بره تو جتریک اگه نه بره به مسیر نام انگلیسیش
        return true
      } else {
        this.router.navigate(['/error/404'])
        return false
      }
    })
  }
}
