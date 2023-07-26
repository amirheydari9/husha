import {Injectable} from '@angular/core';
import {OauthService} from "../../api/oauth.service";
import {TokenStorageService} from "../../utils/token-storage.service";
import {LoginReqDto} from "../../models/DTOs/login-req.dto";
import {Select} from "@ngxs/store";
import {FetchCaptchaAction, FetchUserAvatarAction, FetchUserSettingAction, OauthState} from "./oauth.store";
import {Observable} from "rxjs";
import {ICaptchaRes} from "../../models/interface/captcha-res.interface";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {Navigate} from "@ngxs/router-plugin";
import {IUserAvatarRes} from "../../models/interface/user-avatar-res.interface";
import {IUserSettingRes} from "../../models/interface/user-setting-res.interface";

@Injectable({
  providedIn: 'root'
})
export class OauthFacade {

  constructor(
    private oauthService: OauthService,
    private storageService: TokenStorageService
  ) {
  }

  @Select(OauthState.captcha) captcha$: Observable<ICaptchaRes>
  @Select(OauthState.userAvatar) userAvatar$: Observable<IUserAvatarRes>
  @Select(OauthState.userSettinfg) userSetting$: Observable<IUserSettingRes>

  @Dispatch()
  async loadCaptcha() {
    const data = await this.oauthService.loadCaptcha()
    return new FetchCaptchaAction(data)
  }

  @Dispatch()
  async login(payload: LoginReqDto) {
    const data = await this.oauthService.login(payload)
    this.storageService.saveToken(data.access_token)
    return new Navigate(['/'])
  }


  @Dispatch()
  logout() {
    this.storageService.signOut()
    return new Navigate(['/auth'])
  }

  @Dispatch()
  async fetchUserAvatar() {
    const data = await this.oauthService.fetchUserAvatar()
    return new FetchUserAvatarAction(data)
  }

  @Dispatch()
  async fetchUserSetting() {
    const data = await this.oauthService.fetchUserSetting()
    return new FetchUserSettingAction(data)
  }

}
