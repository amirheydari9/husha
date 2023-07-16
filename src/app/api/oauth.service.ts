import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {LoginReqDto} from "../models/DTOs/login-req.dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(
    private httpService: HttpService
  ) {
  }

  login(payload: LoginReqDto) {
    return this.httpService.post('sso/oauth/token', payload)
  }

  loadCaptcha():Promise<any> {
    return this.httpService.get('sso/oauth/captcha').toPromise()
  }
}
