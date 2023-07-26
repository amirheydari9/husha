import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {LoginReqDto} from "../models/DTOs/login-req.dto";
import {ICaptchaRes} from "../models/interface/captcha-res.interface";
import {ITokenRes} from "../models/interface/token-res.interface";
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

  login(payload: LoginReqDto): Promise<ITokenRes> {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    formData.append('captchaAnswer', payload.captchaAnswer.toString());
    formData.append('captchaId', payload.captchaId);
    formData.append('grant_type', payload.grant_type);
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(environment.basicAuthUsername + ':' + environment.basicAuthPassword)
    });
    return this.httpService.post<ITokenRes>('sso/oauth/token', formData, null, headers).toPromise()
  }

  fetchUserAvatar(): Promise<IUserAvatarRes> {
    return this.httpService.get<IUserAvatarRes>('sso/user/avatar').toPromise()
  }

  fetchUserSetting(): Promise<IUserSettingRes> {
    return this.httpService.get<IUserSettingRes>('sso/userSetting/getOwnUserSetting').toPromise()
  }

}
