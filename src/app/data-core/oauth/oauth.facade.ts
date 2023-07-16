import {Injectable} from '@angular/core';
import {OauthService} from "../../api/oauth.service";
import {TokenStorageService} from "../../utils/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class OauthFacade {

  constructor(
    private oauthService: OauthService,
    private storageService: TokenStorageService
  ) {
  }

  login() {

  }

  async loadCaptch(): Promise<any> {
    await this.oauthService.loadCaptcha()
  }

  logout() {

  }

}
