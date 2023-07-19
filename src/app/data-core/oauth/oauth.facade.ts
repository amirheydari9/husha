import {Injectable} from '@angular/core';
import {OauthService} from "../../api/oauth.service";
import {TokenStorageService} from "../../utils/token-storage.service";
import {LoginReqDto} from "../../models/DTOs/login-req.dto";
import {FileService} from "../../utils/file.service";

@Injectable({
  providedIn: 'root'
})
export class OauthFacade {

  constructor(
    private oauthService: OauthService,
    private storageService: TokenStorageService,
    private fileService: FileService
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
