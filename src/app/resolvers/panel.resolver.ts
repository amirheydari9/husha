import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {TokenStorageService} from "../utils/token-storage.service";

@Injectable()
export class PanelResolver implements Resolve<boolean> {
  constructor(
    private tokenStorageService: TokenStorageService,
  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.tokenStorageService.getToken()) {
      await Promise.all([

      ])
    }
    return true;
  }
}
