import {Component, OnInit, ViewChild} from '@angular/core';
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginReqDto} from "../../../../models/DTOs/login-req.dto";
import {GRANT_TYPES} from "../../../../constants/enums";
import {CaptchaComponent} from "../../../../components/captcha/captcha.component";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {ICaptchaRes} from "../../../../models/interface/captcha-res.interface";

@AutoUnsubscribe()
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
    this.subscription = this.oauthFacade.captcha$.subscribe(data => this.captcha = data)
  }

  async handLogin() {
    try {
      const payload = new LoginReqDto(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['captchaAnswer'].value,
        this.captcha.id,
        GRANT_TYPES.password
      )
      await this.oauthFacade.login(payload)
    } catch (e) {
      console.log(e)
    }
  }

}
