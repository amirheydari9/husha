import {Component, OnInit, ViewChild} from '@angular/core';
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginReqDto} from "../../../../models/DTOs/login-req.dto";
import {GRANT_TYPES} from "../../../../constants/enums";
import {CaptchaComponent} from "../../../../components/captcha/captcha.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  @ViewChild(CaptchaComponent, {static: true}) captchComponent: CaptchaComponent

  loginForm: FormGroup
  captchaId: string

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
    await this.handleFetchCaptcha()
  }

  async handLogin() {
    try {
      const payload = new LoginReqDto(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['captchaAnswer'].value,
        this.captchaId,
        GRANT_TYPES.passwordCaptcha
      )
      await this.oauthFacade.login(payload)
    } catch (e) {
      console.log(e)
    }
  }

  async handleFetchCaptcha(): Promise<void> {
    try {
      await this.oauthFacade.loadCaptcha()
    } catch (e) {
      console.log(e)
    }
  }
}
