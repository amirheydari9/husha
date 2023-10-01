import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {LoginReqDto} from "../models/DTOs/login-req.dto";
import {ICaptchaRes} from "../models/interface/captcha-res.interface";
import {ILoginRes} from "../models/interface/login-res.interface";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IUserAvatarRes} from "../models/interface/user-avatar-res.interface";
import {IUserSettingRes} from "../models/interface/user-setting-res.interface";

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(
    private httpService: HttpService,
  ) {
  }

  loadCaptcha(): Promise<ICaptchaRes> {
    return this.httpService.get<ICaptchaRes>('sso/oauth/captcha').toPromise()
  }

  login(payload: LoginReqDto): Promise<ILoginRes> {
    const formData = this.httpService.toFormData(payload)
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(environment.basicAuthUsername + ':' + environment.basicAuthPassword)
    });
    return this.httpService.post<ILoginRes>('sso/oauth/token', formData, null, headers).toPromise()
  }

  fetchUserAvatar(): Promise<IUserAvatarRes> {
    return this.httpService.get<IUserAvatarRes>('sso/user/avatar').toPromise()
  }

  fetchUserSetting(): Promise<IUserSettingRes> {
    return this.httpService.get<IUserSettingRes>('sso/userSetting/getOwnUserSetting').toPromise()
  }

}
