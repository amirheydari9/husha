import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {LoginReqDto} from "../models/DTOs/login-req.dto";
import {ICaptchaRes} from "../models/interface/captcha-res.interface";
import {ITokenRes} from "../models/interface/token-res.interface";
import {of, pipe} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

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
    // return of({
    //   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjEwOTY5NjAsInVzZXJfbmFtZSI6IjQ2OSIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJqdGkiOiJIaUEzaWF1UExPQzczQWJySWtRVUEyNlk5c0EiLCJjbGllbnRfaWQiOiJIdXNoYU1pY3JvU2VydmljZSIsInNjb3BlIjpbInNlcnZlciJdfQ.crqDQD-HQIHZA7NscJSyna6M3P1yYD8CdRlxHyklowo",
    //   "token_type": "bearer",
    //   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiI0NjkiLCJzY29wZSI6WyJzZXJ2ZXIiXSwiYXRpIjoiSGlBM2lhdVBMT0M3M0FicklrUVVBMjZZOXNBIiwiZXhwIjoxNzIxMTgzMzYwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiUXBhcDB6SUFNV3hWWGFyc3lsTGtnaWVDRTdVIiwiY2xpZW50X2lkIjoiSHVzaGFNaWNyb1NlcnZpY2UifQ.shEuTcnx6JUUMij9FZ6LIfmmgDLi6zivYOVwhci5R9g",
    //   "expires_in": 31536000,
    //   "scope": "server",
    //   "jti": "HiA3iauPLOC73AbrIkQUA26Y9sA"
    // }).pipe().toPromise()
    return this.httpService.post<ITokenRes>('sso/oauth/token', formData, null, headers).toPromise()
  }

}
