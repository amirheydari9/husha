import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginReqDto} from "../../../../models/DTOs/login-req.dto";
import {GRANT_TYPES} from "../../../../constants/enums";
import {CaptchaComponent} from "../../../../components/captcha/captcha.component";
import {Subscription} from "rxjs";
import {ICaptchaRes} from "../../../../models/interface/captcha-res.interface";
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  @ViewChild(CaptchaComponent, {static: true}) captchComponent: CaptchaComponent

  subscription: Subscription
  loginForm: FormGroup
  captcha: ICaptchaRes

  constructor(
    private oauthFacade: OauthFacade,
    private fb: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.loginForm = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      captchaAnswer: this.captchComponent.createCaptcha()
    })
  }

  async handLogin() {
    try {
      const payload = new LoginReqDto(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['captchaAnswer'].value,
        this.captchComponent.captcha.id,
        GRANT_TYPES.PASSWORD_CAPTCHA
      )
      await this.oauthFacade.login(payload)
    } catch (e) {
      console.log(e)
    }
  }

}
