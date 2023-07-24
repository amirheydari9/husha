import {Injectable} from '@angular/core';
import {OauthService} from "../../api/oauth.service";
import {TokenStorageService} from "../../utils/token-storage.service";
import {LoginReqDto} from "../../models/DTOs/login-req.dto";

@Injectable({
  providedIn: 'root'
})
export class OauthFacade {

  constructor(
    private oauthService: OauthService,
    private storageService: TokenStorageService
  ) {
  }

  async login(payload: LoginReqDto) {
    await this.oauthService.login(payload)
  }

  async loadCaptcha(): Promise<any> {
    await this.oauthService.loadCaptcha()
  }

  logout() {

  }

}
